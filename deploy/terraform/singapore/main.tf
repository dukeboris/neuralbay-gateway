# NeuralBay Gateway — Singapore Region (GCP asia-southeast1)
# Serves: SEA (Indonesia, Thailand, Vietnam, Malaysia, Philippines)

terraform {
  required_version = ">= 1.5"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
  backend "gcs" {
    bucket = "neuralbay-tfstate-singapore"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = "asia-southeast1"
  zone    = "asia-southeast1-a"
}

variable "project_id" {
  description = "GCP Project ID"
}

variable "environment" {
  default = "production"
}

variable "node_name" {
  default = "neuralbay-singapore-01"
}

# VPC
resource "google_compute_network" "main" {
  name                    = "neuralbay-singapore-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "main" {
  name          = "neuralbay-singapore-subnet"
  network       = google_compute_network.main.id
  ip_cidr_range = "10.2.0.0/16"
  region        = "asia-southeast1"
}

# Firewall
resource "google_compute_firewall" "allow_http" {
  name    = "neuralbay-allow-http"
  network = google_compute_network.main.id

  allow {
    protocol = "tcp"
    ports    = ["80", "443", "3000", "22"]
  }
  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_firewall" "allow_internal" {
  name    = "neuralbay-allow-internal"
  network = google_compute_network.main.id

  allow {
    protocol = "tcp"
    ports    = ["5432", "6379", "9090"]
  }
  source_ranges = ["10.0.0.0/8"]
}

# Static IP
resource "google_compute_global_address" "gateway" {
  name = "neuralbay-singapore-ip"
}

# Cloud SQL PostgreSQL
resource "google_sql_database_instance" "main" {
  name             = "neuralbay-singapore-db"
  database_version = "POSTGRES_15"
  region           = "asia-southeast1"

  settings {
    tier      = "db-custom-2-4096"
    disk_size = 100
    disk_type = "PD_SSD"

    backup_configuration {
      enabled = true
    }
  }
}

resource "google_sql_database" "main" {
  name     = "neuralbay"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "main" {
  name     = "neuralbay"
  instance = google_sql_database_instance.main.name
  password = var.db_password
}

# Memorystore Redis
resource "google_redis_instance" "main" {
  name           = "neuralbay-singapore-redis"
  tier           = "STANDARD_HA"
  memory_size_gb = 2
  region         = "asia-southeast1"
  redis_version  = "REDIS_7_0"
}

# Compute Engine
resource "google_compute_instance" "gateway" {
  name         = "neuralbay-singapore-gateway"
  machine_type = "e2-standard-2"
  zone         = "asia-southeast1-a"

  boot_disk {
    initialize_params {
      image = "cos-cloud/cos-stable"
      size  = 50
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.main.id
    access_config {
      nat_ip = google_compute_global_address.gateway.address
    }
  }

  metadata = {
    gce-container-declaration = <<-EOF
      spec:
        containers:
          - name: neuralbay
            image: neuralbay/neuralbay-gateway:latest
            ports:
              - containerPort: 3000
            env:
              - name: NODE_REGION
                value: "singapore"
              - name: NODE_NAME
                value: "neuralbay-singapore-01"
              - name: DB_TYPE
                value: "postgres"
              - name: DSN
                value: "host=${google_sql_database_instance.main.public_ip_address} user=neuralbay password=${var.db_password} dbname=neuralbay"
              - name: REDIS_CONN_STRING
                value: "redis://:${var.redis_auth}@${google_redis_instance.main.host}:6379"
              - name: TZ
                value: "Asia/Singapore"
            stdin: false
            tty: false
        restartPolicy: Always
    EOF
  }

  tags = ["neuralbay", "singapore"]
}

variable "db_password" {
  sensitive = true
}

variable "redis_auth" {
  sensitive = true
}

output "public_ip" {
  value = google_compute_global_address.gateway.address
}

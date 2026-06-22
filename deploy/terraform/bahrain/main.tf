# NeuralBay Gateway — Bahrain Region (AWS me-south-1)
# Serves: GCC (Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain)

terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "neuralbay-tfstate-bahrain"
    key    = "terraform.tfstate"
    region = "me-south-1"
  }
}

provider "aws" {
  region = "me-south-1"
}

variable "environment" {
  default = "production"
}

variable "node_name" {
  default = "neuralbay-bahrain-01"
}

variable "ssh_key_name" {
  description = "SSH key pair for EC2 access"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.1.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "neuralbay-bahrain-vpc" }
}

resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.1.1.0/24"
  availability_zone       = "me-south-1a"
  map_public_ip_on_launch = true
  tags = { Name = "neuralbay-bahrain-public-a" }
}

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.1.2.0/24"
  availability_zone       = "me-south-1b"
  map_public_ip_on_launch = true
  tags = { Name = "neuralbay-bahrain-public-b" }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "neuralbay-bahrain-igw" }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
}

resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}

# Security Group
resource "aws_security_group" "gateway" {
  vpc_id = aws_vpc.main.id
  name   = "neuralbay-gateway-sg"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"] # Prometheus — internal only
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 Instance
resource "aws_instance" "gateway" {
  ami                    = "ami-0abcdef1234567890" # Amazon Linux 2023 me-south-1
  instance_type          = "t3.large"
  key_name               = var.ssh_key_name
  vpc_security_group_ids = [aws_security_group.gateway.id]
  subnet_id              = aws_subnet.public_a.id

  root_block_device {
    volume_size = 50
    volume_type = "gp3"
  }

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y docker
    systemctl start docker
    systemctl enable docker

    # Pull and run NeuralBay
    docker run -d --restart=always --name neuralbay \
      -p 3000:3000 \
      -e NODE_REGION=bahrain \
      -e NODE_NAME=neuralbay-bahrain-01 \
      -e DB_TYPE=postgres \
      -e DSN="host=${aws_db_instance.main.address} user=neuralbay password=$${DB_PASSWORD} dbname=neuralbay" \
      -e REDIS_CONN_STRING="redis://:$${REDIS_PASSWORD}@${aws_elasticache_cluster.main.cache_nodes[0].address}:6379" \
      -e TZ=Asia/Riyadh \
      neuralbay/neuralbay-gateway:latest
  EOF

  tags = {
    Name   = "neuralbay-bahrain-gateway"
    Region = "bahrain"
  }
}

# PostgreSQL RDS
resource "aws_db_instance" "main" {
  identifier           = "neuralbay-bahrain-db"
  engine               = "postgres"
  engine_version       = "15"
  instance_class       = "db.t3.medium"
  allocated_storage    = 100
  storage_type         = "gp3"
  db_name              = "neuralbay"
  username             = "neuralbay"
  password             = var.db_password
  skip_final_snapshot  = false
  publicly_accessible  = false
  db_subnet_group_name = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.gateway.id]
  backup_retention_period = 7
  multi_az             = true
  tags = { Name = "neuralbay-bahrain-db" }
}

resource "aws_db_subnet_group" "main" {
  subnet_ids = [aws_subnet.public_a.id, aws_subnet.public_b.id]
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "main" {
  cluster_id           = "neuralbay-bahrain-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.gateway.id]
}

resource "aws_elasticache_subnet_group" "main" {
  subnet_ids = [aws_subnet.public_a.id, aws_subnet.public_b.id]
}

variable "db_password" {
  sensitive = true
}

output "public_ip" {
  value = aws_instance.gateway.public_ip
}

output "db_endpoint" {
  value = aws_db_instance.main.address
}

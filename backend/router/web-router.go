package router

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/controller"
	"github.com/QuantumNous/new-api/middleware"
	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

// ThemeAssets holds the embedded frontend assets for both themes.
type ThemeAssets struct {
	DefaultBuildFS   embed.FS
	DefaultIndexPage []byte
	ClassicBuildFS   embed.FS
	ClassicIndexPage []byte
}

func SetWebRouter(router *gin.Engine, assets ThemeAssets) {
	defaultFS := common.EmbedFolder(assets.DefaultBuildFS, "web/default/dist")
	classicFS := common.EmbedFolder(assets.ClassicBuildFS, "web/classic/dist")
	themeFS := common.NewThemeAwareFS(defaultFS, classicFS)

	// Serve /_next/static files via http.FileServer
	// NOTE: Go embed excludes files/dirs starting with "_", so we renamed
	// _next -> next in the dist directory. Requests for /_next/ are rewritten.
	subFS, _ := fs.Sub(assets.DefaultBuildFS, "web/default/dist")
	fileServer := http.FileServer(http.FS(subFS))
	router.GET("/_next/static/*filepath", func(c *gin.Context) {
		// Rewrite /_next/static/... -> /next/static/... (Go embed safe path)
		newPath := "/next/static/" + c.Param("filepath")
		c.Request.URL.Path = newPath
		common.SysLog(fmt.Sprintf("Static serve: %s -> %s", c.Request.RequestURI, newPath))
		fileServer.ServeHTTP(c.Writer, c.Request)
		c.Abort()
	})

	router.Use(gzip.Gzip(gzip.DefaultCompression))
	router.Use(middleware.GlobalWebRateLimit())
	router.Use(middleware.Cache())
	router.Use(static.Serve("/", themeFS))
	router.NoRoute(func(c *gin.Context) {
		c.Set(middleware.RouteTagKey, "web")
		if strings.HasPrefix(c.Request.RequestURI, "/v1") || strings.HasPrefix(c.Request.RequestURI, "/api") || strings.HasPrefix(c.Request.RequestURI, "/assets") {
			controller.RelayNotFound(c)
			return
		}
		c.Header("Cache-Control", "no-cache")
		if common.GetTheme() == "classic" {
			c.Data(http.StatusOK, "text/html; charset=utf-8", assets.ClassicIndexPage)
		} else {
			c.Data(http.StatusOK, "text/html; charset=utf-8", assets.DefaultIndexPage)
		}
	})
}

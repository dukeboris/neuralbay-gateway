package common

import (
	"fmt"
	"embed"
	"io/fs"
	"net/http"
	"os"
	"strings"

	"github.com/gin-contrib/static"
)

type embedFileSystem struct {
	http.FileSystem
	rawFS fs.FS
}

func (e *embedFileSystem) Exists(prefix string, path string) bool {
	cleanPath := strings.TrimPrefix(path, "/")
	if cleanPath == "" {
		return false
	}
	_, err := e.rawFS.Open(cleanPath)
	SysLog(fmt.Sprintf("EmbedExists: path=%q clean=%q err=%v", path, cleanPath, err))
	return err == nil
}

func (e *embedFileSystem) Open(name string) (http.File, error) {
	if name == "/" {
		return nil, os.ErrNotExist
	}
	if len(name) > 0 && name[0] == '/' {
		name = name[1:]
	}
	return e.FileSystem.Open(name)
}

func EmbedFolder(fsEmbed embed.FS, targetPath string) static.ServeFileSystem {
	efs, err := fs.Sub(fsEmbed, targetPath)
	if err != nil {
		panic(err)
	}
	return &embedFileSystem{
		FileSystem: http.FS(efs),
		rawFS:      efs,
	}
}

type themeAwareFileSystem struct {
	defaultFS static.ServeFileSystem
	classicFS static.ServeFileSystem
}

func (t *themeAwareFileSystem) Exists(prefix string, path string) bool {
	if GetTheme() == "classic" {
		return t.classicFS.Exists(prefix, path)
	}
	return t.defaultFS.Exists(prefix, path)
}

func (t *themeAwareFileSystem) Open(name string) (http.File, error) {
	if GetTheme() == "classic" {
		return t.classicFS.Open(name)
	}
	return t.defaultFS.Open(name)
}

func NewThemeAwareFS(defaultFS, classicFS static.ServeFileSystem) static.ServeFileSystem {
	return &themeAwareFileSystem{defaultFS: defaultFS, classicFS: classicFS}
}
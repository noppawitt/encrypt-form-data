package main

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	e := gin.New()
	e.Use(decryptPayload("secret"))

	e.POST("/api/upload", func(ctx *gin.Context) {
		var req struct {
			Email  string                  `form:"email"`
			Images []*multipart.FileHeader `form:"images"`
		}

		if err := ctx.ShouldBind(&req); err != nil {
			ctx.String(http.StatusBadRequest, err.Error())
			return
		}

		fmt.Println(req.Email)

		for _, image := range req.Images {
			mf, err := image.Open()
			if err != nil {
				ctx.String(http.StatusInternalServerError, err.Error())
				return
			}

			f, err := os.Create("./uploads/" + image.Filename)
			if err != nil {
				ctx.String(http.StatusInternalServerError, err.Error())
				return
			}

			_, err = io.Copy(f, mf)
			if err != nil {
				ctx.String(http.StatusInternalServerError, err.Error())
				return
			}
		}

		ctx.Status(http.StatusOK)
	})

	e.Run(":8080")
}

func decryptPayload(key string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		encrypted, err := io.ReadAll(ctx.Request.Body)
		if err != nil {
			ctx.String(http.StatusInternalServerError, err.Error())
			return
		}

		decrypted := xor(encrypted, []byte(key))
		ctx.Request.Body = io.NopCloser(bytes.NewReader(decrypted))

		ctx.Next()
	}
}

func xor(input, key []byte) []byte {
	result := make([]byte, len(input))
	for i := 0; i < len(input); i++ {
		result[i] = input[i] ^ key[i%len(key)]
	}
	return result
}

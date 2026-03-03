package main

import (
	"bytes"
	"image/png"
	"log"
	"os"
	"strings"

	webp "github.com/HugoSmits86/nativewebp"
)

func convertToWebp(pngData []byte, filepath string) {
	// Decode the PNG data into an image.Image
	img, err := png.Decode(bytes.NewReader(pngData))

	if err != nil {
		log.Fatalln(err)
	}

	var webpFilepath = strings.Replace(filepath, ".png", ".webp", 1)

	var fileHandle, _ = os.Create(webpFilepath)
	defer fileHandle.Close()

	// Encode the image to WebP format in the buffer
	err = webp.Encode(fileHandle, img, nil)
	log.Println(err)
	os.Exit(0)
}

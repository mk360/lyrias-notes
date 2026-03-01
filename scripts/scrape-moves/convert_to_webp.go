package main

import (
	"bytes"
	"image"
	"os"

	"image/webp"
)

func convertToWebp(data []byte, filename string) {
	img, _, _ := image.Decode(bytes.NewReader(data))
	file, err := os.Create(filename)
	defer file.Close()
	err = webp.()
}
"use client";

import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { Cropper, CropperRef, CircleStencil } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { FaUserCircle } from "react-icons/fa";

const ImageCropper = ({
  onImageCropped,
}: {
  onImageCropped: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);
  const [imgCropped, setImgCropped] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const onUpload = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onCrop = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        const croppedImage = canvas.toDataURL();
        setImgCropped(croppedImage);
        onImageCropped(croppedImage);
        setIsModalOpen(false); // Fecha o modal após o corte
      }
    }
  };

  const onLoadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setIsModalOpen(true); // Abre o modal ao carregar uma imagem
    }
    event.target.value = "";
  };

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      <IconButton onClick={onUpload} sx={{ p: 0 }}>
        {imgCropped ? (
          <Avatar
            src={imgCropped}
            alt="Profile"
            sx={{ width: 100, height: 100 }}
          />
        ) : (
          <FaUserCircle size={100} color="#cccccc" />
        )}
      </IconButton>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onLoadImage}
        style={{ display: "none" }}
      />
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogContent sx={{ width: "100%", maxWidth: 500 }}>
          <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
            Ajuste a Imagem
          </Typography>
          <Cropper
            ref={cropperRef}
            className="imageCropper__cropper"
            src={image || ""}
            stencilComponent={CircleStencil}
            style={{
              height: 300,
              width: "100%",
              backgroundColor: "#f0f0f0",
              borderRadius: "8px",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={onCrop}
            sx={{ mx: "auto", px: 4 }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageCropper;

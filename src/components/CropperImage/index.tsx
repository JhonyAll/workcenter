'use client'
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { Cropper, CropperRef, CircleStencil } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import "./styles.scss";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

const ImageCropper = ({onImageCropped}: {onImageCropped: React.Dispatch<React.SetStateAction<string | null>>}) => {
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
        setImgCropped(canvas.toDataURL());
        setIsModalOpen(false); // Fecha o modal após o corte
        onImageCropped(canvas.toDataURL())
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
    <div className="imageCropper">
      <div className="profile-icon rounded-full" onClick={onUpload}>
        {imgCropped ? (
          <Image src={imgCropped} className="rounded-full" alt="Profile" width={200} height={200} />
        ) : (
          <FaUserCircle size={200} color="#cccccc" />
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onLoadImage}
        style={{ display: "none" }}
      />
      {isModalOpen && (
        <div className="modal z-20">
          <div className="modal-content">
            <div className="cropper-wrapper">
              <Cropper
                ref={cropperRef}
                className="imageCropper__cropper"
                backgroundClassName="imageCropper__cropper-background"
                src={image || ""}
                stencilComponent={CircleStencil}
              />
            </div>
            <button className="imageCropper__button font-bold text-lg " onClick={onCrop}>
              Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;

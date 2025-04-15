"use client";
import React, { useEffect, useState } from "react";
import Container from "@/components/ui/container";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Image from "next/image";
import ButtonCustom from "@/components/ui/button";
import { IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
interface Image {
  id: number;
  url: string;
  alt: string;
}

interface ImagesResponse {
  images: Image[];
  total?: any;
}

export default function GalleryPage() {
  const [images, setImages] = useState<ImagesResponse>({ images: [] });
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });

  const handleDeleteClick = (imageId: number) => {
    setImageToDelete(imageId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setImageToDelete(null);
  };

  const deleteImage = async () => {
    if (!imageToDelete) return;

    setLoading(true);
    try {
      const response = await axios.delete(`/api/gallery?id=${imageToDelete}`);
      if (response.status === 200) {
        fetchImages();
        handleCloseDialog();
      }
    } catch (error) {
      console.error("Error deleting image", error);
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "url",
      headerName: "Miniaturka",
      width: 200,
      renderCell: (params) => (
        <Image
          src={params.value}
          alt={params.row.alt}
          width={100}
          height={100}
        />
      ),
    },
    { field: "alt", headerName: "ALT", width: 200 },
    {
      headerName: "URL",
      field: "url-name",
      width: 300,
      renderCell: (params) => {
        const handleCopy = () => {
          navigator.clipboard?.writeText(params?.row?.url);
        };

        return (
          <div style={{ display: "flex", alignItems: "center" }}>

            <Tooltip title="Kopiuj">
              <IconButton onClick={handleCopy} size="small">
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <p style={{ marginRight: 8 }}>{params.row.url}</p>
          </div>
        );
      }
    },
    {
      field: "actions",
      headerName: "Akcje",
      width: 100,
      renderCell: (params) => (
        <DeleteIcon
          onClick={() => handleDeleteClick(params.row.id)}
          sx={{ cursor: "pointer" }}
        />
      ),
    },
  ];

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/gallery?page=${pagination.page + 1}&limit=${pagination.pageSize}`
      );
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [pagination]);

  return (
    <>
      <Container>
        <div className="p-10 flex flex-row text-center algin-center justify-center gap-10">
          <h2 className="text-[2rem] flex items-end">Lista zdjęć galeria</h2>
          <ButtonCustom title="Dodaj zdjęcie" href="/gallery/new" />
        </div>
        <Paper sx={{ margin: "2rem", padding: "2rem" }}>
          <DataGrid
            rows={images.images}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10]}
            paginationModel={pagination}
            paginationMode='server'
            rowCount={images?.total || 0}
            sx={{ border: 0 }}
            onPaginationModelChange={setPagination}
          />
        </Paper>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Potwierdź usunięcie"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Czy na pewno chcesz usunąć to zdjęcie? Tej operacji nie można
              cofnąć.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Anuluj</Button>
            <Button onClick={deleteImage} color="error" autoFocus>
              Usuń
            </Button>
          </DialogActions>
        </Dialog>
      </Container></>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Container from "@/components/ui/container";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

interface Post {
  id: number;
  pl_slug: string;
  pl_title: string;
  en_slug: string;
  en_title: string;
  de_slug: string;
  de_title: string;
  imgUrl: string;
  alt: string;
}

interface PostsResponse {
  posts: Post[];
  total?: any;
}

export default function BlogPageContainer() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostsResponse>({ posts: [] });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [openDialog, setOpenDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const handleDeleteClick = (postId: number) => {
    setPostToDelete(postId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPostToDelete(null);
  };

  // 🔄 Usuwanie posta zgodnie z jego ID
  const deletePost = async () => {
    if (!postToDelete) return;

    setLoading(true);
    try {
      const response = await axios.delete(`/api/blog?id=${postToDelete}`);
      if (response.status === 200) {
        console.log("Post successfully deleted");
        fetchData();
        handleCloseDialog();
      }
    } catch (error) {
      console.error("Błąd usuwania posta", error);
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "pl_slug", headerName: "Polski slug", width: 200 },
    { field: "pl_title", headerName: "Polski tytuł", width: 200 },
    { field: "en_slug", headerName: "Angielski slug", width: 200 },
    { field: "en_title", headerName: "Angielski tytuł", width: 200 },
    { field: "de_slug", headerName: "Niemiecki slug", width: 200 },
    { field: "de_title", headerName: "Niemiecki tytuł", width: 200 },
    { field: "imgUrl", headerName: "URL zdjęcia", width: 200 },
    { field: "alt", headerName: "ALT", width: 200 },
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

  // 🔄 Pobieranie danych z API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/blog?page=${pagination.page + 1}&limit=${pagination.pageSize}`
      );

      setPosts(response.data);
    } catch (error) {
      console.error("Błąd ładowania postów", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Pobieranie danych po zmianie paginacji
  useEffect(() => {
    fetchData();
  }, [pagination]);

  return (
    <Container>
      <Paper sx={{ height: "100%", margin: "2rem", padding: "2rem" }}>
        <DataGrid
          rows={posts?.posts}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10]}
          paginationModel={pagination}
          onPaginationModelChange={setPagination}
          paginationMode="server"
          sx={{ border: 0 }}
          rowCount={posts?.total}
          onCellClick={(params, event) => {
            if (params.field === 'actions') {
              event.stopPropagation();
              return;
            }

            router.push(`/blog/${params.row.id}`);
          }}
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
            Czy na pewno chcesz usunąć ten wpis? Tej operacji nie można cofnąć.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Anuluj</Button>
          <Button onClick={deletePost} color="error" autoFocus>
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

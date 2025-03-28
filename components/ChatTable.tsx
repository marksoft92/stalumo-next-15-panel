"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Container from "@/components/ui/container";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

interface Chat {
  id: number;
  email: string;
  topic: string;
  content: string;
  read_me: boolean;
  reply: string | null;
  createdAt: string;
}

interface ChatsResponse {
  chats: Chat[];
  total?: any;
}

export default function ChatTable() {
  const router = useRouter();
  const [chats, setChats] = useState<ChatsResponse>({ chats: [] });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [openDialog, setOpenDialog] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<number | null>(null);

  const handleDeleteClick = (chatId: number) => {
    setChatToDelete(chatId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setChatToDelete(null);
  };

  // 🔄 Usuwanie chatu zgodnie z jego ID
  const deleteChat = async () => {
    if (!chatToDelete) return;

    setLoading(true);
    try {
      const response = await axios.delete(`/api/contact?id=${chatToDelete}`);
      if (response.status === 200) {
        console.log("Chat successfully deleted");
        fetchChats();
        handleCloseDialog();
      }
    } catch (error) {
      console.error("Błąd usuwania chatu", error);
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      renderCell: (params) => (
        <>
          {params.value}
          {params.row.read_me ? (
            <MarkEmailReadIcon sx={{ ml: 1 }} />
          ) : (
            <MarkEmailUnreadIcon sx={{ ml: 1 }} />
          )}
        </>
      ),
    },
    { field: "email", headerName: "Email", width: 200 },
    { field: "topic", headerName: "Temat", width: 200 },
    { field: "content", headerName: "Treść", width: 200 },
    {
      field: "read_me",
      headerName: "Odczytane",
      width: 100,
      renderCell: (params) => (params.value ? "Tak" : "Nie"),
    },
    { field: "reply", headerName: "Odpowiedź", width: 200 },
    { field: "createdAt", headerName: "Data utworzenia", width: 200 },
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
  const fetchChats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/contact?page=${pagination.page + 1}&limit=${pagination.pageSize}`
      );

      setChats(response.data);
    } catch (error) {
      console.error("Błąd ładowania chatów", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Pobieranie danych po zmianie paginacji
  useEffect(() => {
    fetchChats();
  }, [pagination]);

  console.log(chats);
  return (
    <Container>
      <Paper sx={{ height: "100%", margin: "2rem", padding: "2rem" }}>
        <DataGrid
          rows={chats?.chats}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10]}
          paginationModel={pagination}
          onPaginationModelChange={setPagination}
          paginationMode="server"
          sx={{ border: 0 }}
          rowCount={chats?.total}
          getRowClassName={(params) =>
            !params.row.read_me ? "unread-row" : ""
          }
        />
      </Paper>

      <style jsx global>{`
        .unread-row {
          background-color: rgba(0, 0, 0, 0.1);
        }
      `}</style>

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
            Czy na pewno chcesz usunąć ten chat? Tej operacji nie można cofnąć.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Anuluj</Button>
          <Button onClick={deleteChat} color="error" autoFocus>
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

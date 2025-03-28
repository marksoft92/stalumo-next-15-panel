"use client";
import Container from "@/components/ui/container";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Link from "next/link";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "alt", headerName: "ALT", width: 100 },
  { field: "pl_slug", headerName: "Polski slug", width: 100 },
  { field: "en_slug", headerName: "Angielski slug", width: 100 },
  { field: "de_slug", headerName: "Niemiecki slug", width: 100 },
  { field: "imgUrl", headerName: "url zdjęcia", width: 100 },
];

// Funkcja do generowania metadanych SEO
const paginationModel = { page: 0, pageSize: 5 };
// Pobieranie początkowych postów z API

const BlogPageContainer = async ({ posts }: { posts: any }) => {
  console.log(posts);
  return (
    <Container>
      <Paper sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={posts}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
          // onCellClick={}
        />
      </Paper>
    </Container>
  );
};

export default BlogPageContainer;

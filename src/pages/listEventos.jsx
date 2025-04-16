import { useState, useEffect } from "react";
// Imports para criação de tabela
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
// TableHead é onde colocamos os titulos
import TableHead from "@mui/material/TableHead";
// TableBody é onde colocamos o conteúdo
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import api from "../axios/axios";
import { Button, IconButton, Alert, Snackbar } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";

function listEvento() {
  const [events, setEvento] = useState([]);
  const [alert, setAlert] = useState({
    // visibilidade (false = oculto; true = visível)
    open: false,

    // nível do alerta (sucess, error, warning, etc)
    severity: "",

    // mensagem que será exibida
    message: "",
  });

  // função para exibir o alerta
  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  // fechar o alerta
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const navigate = useNavigate();

  async function getEvento() {
    // Chamada da Api
    await api.getEvento().then(
      (response) => {
        console.log(response.data.events);
        setEvento(response.data.events);
      },
      (error) => {
        console.log("Erro ", error);
      }
    );
  }

  async function deleteEvento(id) {
    try {
      await api.deleteEvento(id);
      await getEvento();
      showAlert("success", "Evento excluído com sucesso!");
    } catch (error) {
      console.log("Erro ao deletar evento...", error);
      showAlert("error", error.response.data.error);
    }
  }

  const listEvento = events.map((evento) => {
    return (
      <TableRow key={evento.id_evento}>
        <TableCell align="center">{evento.n0me}</TableCell>
        <TableCell align="center">{evento.descricao}</TableCell>
        <TableCell align="center">{evento.data_hora}</TableCell>
        <TableCell align="center">{evento.local}</TableCell>
        <TableCell align="center">{evento.fk_id_organizador}</TableCell>

        <TableCell align="center">
          <IconButton onClick={() => deleteEvento(evento.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  });

  function logout() {
    localStorage.removeItem("authenticated");
    navigate("/");
  }

  useEffect(() => {
    // if (!localStorage.getItem("authenticated")) {
    //   navigate("/"); //navegue para a rota inicial
    // }
    getEvento();
  }, []);

  return (
    <div>
      <Snackbar open = {alert.open} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin={{vertical:"top", horizontal:"center"}}>
      <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{width:"100%"}}>
        {alert.message}
      </Alert>
      </Snackbar>
      {events.length === 0 ? ( //? = após a '?' é true
        <p>Carregando eventos</p>
      ) : (
        //após os ':' é false
        <div>
          <h5>Lista de eventos</h5>
          <TableContainer component={Paper} style={{ margin: "2px" }}>
            <Table size="small">
              <TableHead
                style={{ backgroundColor: "#FF84C6", borderStyle: "solid" }}
              >
                <TableRow>
                  <TableCell align="center">Nome</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">CPF</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{listEvento}</TableBody>
            </Table>
          </TableContainer>
          <Button
            fullWidth
            variant="contained"
            onClick={logout}
            sx={{ backgroundColor: "#EF007E" }}
          >
            SAIR
          </Button>
        </div>
      )}
    </div>
  );
}
export default listEvento;

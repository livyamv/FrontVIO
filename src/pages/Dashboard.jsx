import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import sheets from "../axios/axios";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale
);

function Dashboard() {
  const [eventos, setEventos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    async function getDados() {
      try {
        const responseEventos = await sheets.getEvento();
        const responseUsuarios = await sheets.getUsers();
        setEventos(responseEventos.data.events);
        setUsuarios(responseUsuarios.data.users);
      } catch (error) {
        console.error(error);
      }
    }
    getDados();
  }, []);

  // processa dados fora do useEffect
  const eventosPorOrganizador = {};
  eventos.forEach((evento) => {
    const orgId = evento.fk_id_organizador;
    eventosPorOrganizador[orgId] =
      (eventosPorOrganizador[orgId] || 0) + 1;
  });

  const barData = {
    labels: Object.keys(eventosPorOrganizador),
    datasets: [
      {
        label: "Eventos por Organizador",
        data: Object.values(eventosPorOrganizador),
        backgroundColor: "rgba(143, 122, 205, 0.6)",
      },
    ],
  };

// Dados para gráfico de usuários por mês de nascimento
  const usuariosPorMes = {};
  usuarios.forEach(u => {
    const mes = new Date(u.data_nascimento).getMonth() + 1;
    usuariosPorMes[mes] = (usuariosPorMes[mes] || 0) + 1;
  });

  const pieData = {
    labels: Object.keys(usuariosPorMes).map(m => `Mês ${m}`),
    datasets: [
      {
        data: Object.values(usuariosPorMes),
        backgroundColor: ["#d57b8eff", "#ffb1ffff", "#a6e4ffff", "#b0ffb3ff", "#ffcf88ff", "#f3aeffff"]
      }
    ]
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      <div style={{ width: "600px", marginBottom: 40 }}>
        <Bar data={barData} />
      </div>
      <div style={{ width: "400px" }}>
        <Pie data={pieData} />
      </div>
    </div>
  );
}


export default Dashboard;

import { db } from './auth';

const API_BASE_URL = "https://www.consorcionacionalhonda.com.br/api";


// Função para buscar veículos de todas as categorias
export const fetchVeiculos = async (estado) => {
  try {
    const response = await fetch(`${API_BASE_URL}/veiculos/categorias/list/${estado}/motos`);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    const data = await response.json();

    // Verifica se há categorias e veículos
    if (data.vehicles && data.vehicles.length > 0) {
      const veiculos = data.vehicles.flatMap((categoria) => categoria.vehicles || []); // Junta todos os veículos em um único array

      // Ordena os veículos pelo valor de crédito (convertendo para número)
      veiculos.sort((a, b) => {
        const valorA = parseFloat(a.creditValue.replace(/\./g, '').replace(',', '.'));
        const valorB = parseFloat(b.creditValue.replace(/\./g, '').replace(',', '.'));
        return valorA - valorB;
      });

      return veiculos; // Retorna todos os veículos encontrados
    } else {
      throw new Error("Nenhuma categoria ou veículo encontrado.");
    }
  } catch (error) {
    console.error("Erro ao buscar veículos:", error);
    throw error;
  }
};

// Função para buscar os planos de parcelas de um veículo específico
export const fetchPlanos = async (estado, modelo) => {
  try {
    const response = await fetch(`${API_BASE_URL}/veiculo/plans/${estado}/${modelo}`);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    const data = await response.json();
    return data; // Retorna os dados da API
  } catch (error) {
    console.error("Erro ao buscar planos:", error);
    throw error;
  }
};


// Função para buscar os detalhes da moto
export const fetchDetalhes = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/veiculo/detalhes/${slug}`);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    const data = await response.json();
    return data; // Retorna os detalhes da moto
  } catch (error) {
    console.error("Erro ao buscar detalhes da moto:", error);
    throw error;
  }
};
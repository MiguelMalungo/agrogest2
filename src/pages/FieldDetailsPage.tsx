import { useParams, useNavigate } from 'react-router-dom';
import { useFieldStore } from '@/stores/useFieldStore';
import { Button } from '@/components/ui/Button';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Trash2, Edit } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function FieldDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getField, deleteField, toggleFieldStatus } = useFieldStore();
  
  const field = id ? getField(id) : null;

  if (!field) {
    return (
      <div className="container mx-auto p-4">
        <p>Campo não encontrado</p>
        <Button onClick={() => navigate('/campos')} className="mt-4">
          Voltar para a lista
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este campo? Esta ação não pode ser desfeita.')) {
      deleteField(field.id);
      navigate('/campos');
    }
  };

  const handleToggleStatus = () => {
    toggleFieldStatus(field.id);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, "dd/MM/yyyy 'às' HH:mm", { locale: pt });
  };

  const formatFieldType = (type: string) => {
    const types: Record<string, string> = {
      'campo_aberto': 'Campo Aberto',
      'estufa': 'Estufa',
      'vinha': 'Vinha',
      'olival': 'Olival',
      'pomar': 'Pomar',
      'outro': 'Outro'
    };
    return types[type] || type;
  };

  const formatSoilType = (type: string) => {
    const types: Record<string, string> = {
      'arenoso': 'Arenoso',
      'argiloso': 'Argiloso',
      'humoso': 'Humoso',
      'misto': 'Misto',
      'outro': 'Outro'
    };
    return types[type] || type;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{field.nome}</h1>
          <p className="text-sm text-gray-500">
            {field.ativo ? (
              <span className="text-green-600">Ativo</span>
            ) : (
              <span className="text-red-600">Inativo</span>
            )}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/campos/editar/${field.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleStatus}
            className={field.ativo ? 'bg-red-50 hover:bg-red-100' : 'bg-green-50 hover:bg-green-100'}
          >
            {field.ativo ? 'Desativar' : 'Ativar'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Informações Gerais</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
                <p className="mt-1">{field.descricao || 'Nenhuma descrição fornecida'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tipo de Campo</h3>
                  <p className="mt-1">{formatFieldType(field.tipo)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tipo de Solo</h3>
                  <p className="mt-1">{formatSoilType(field.tipoSolo)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Área</h3>
                  <p className="mt-1">{field.area} hectares</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Capacidade de Irrigação</h3>
                  <p className="mt-1">{field.capacidadeIrrigacao} m³/h</p>
                </div>
              </div>
            </div>
          </Card>

          {field.observacoes && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Observações</h2>
              <p className="whitespace-pre-line">{field.observacoes}</p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Metadados</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Criado em</h3>
                <p className="mt-1">{formatDate(field.dataCriacao)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Última atualização</h3>
                <p className="mt-1">{formatDate(field.dataAtualizacao)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1">
                  {field.ativo ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Ativo
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Inativo
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Localização</h2>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-md flex items-center justify-center">
              <p className="text-sm text-gray-500">
                {field.coordenadas && 
                 typeof field.coordenadas === 'object' && 
                 'lat' in field.coordenadas && 
                 'lng' in field.coordenadas ? 
                  `Lat: ${field.coordenadas.lat}, Lng: ${field.coordenadas.lng}` : 
                  'Localização não disponível'}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useNavigate, useParams } from 'react-router-dom';
import { useFieldStore } from '@/stores/useFieldStore';
import { Field, FieldType, SoilType } from '@/types/field';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FieldFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { addField, updateField, getField } = useFieldStore();
  
  const [formData, setFormData] = useState<Omit<Field, 'id' | 'dataCriacao' | 'dataAtualizacao' | 'userId'> & { userId: string }>({
    userId: 'current-user-id', // TODO: Substituir pelo ID do usuário logado
    nome: '',
    descricao: '',
    tipo: 'campo_aberto',
    tipoSolo: 'misto',
    area: 0,
    capacidadeIrrigacao: 0,
    observacoes: '',
    coordenadas: null,
    ativo: true
  });

  const isEditing = !!id;

  useEffect(() => {
    if (id) {
      const field = getField(id);
      if (field) {
        setFormData(field);
      }
    }
  }, [id, getField]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome) {
      alert('O nome do campo é obrigatório');
      return;
    }

    const fieldData = {
      ...formData,
      userId: 'current-user-id' // TODO: Substituir pelo ID do usuário logado
    };

    if (isEditing && id) {
      updateField(id, fieldData);
    } else {
      addField(fieldData);
    }
    
    navigate('/campos');
  };

  return (
    <div className="container mx-auto p-4 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6 text-white">
        {isEditing ? 'Editar Campo' : 'Adicionar Novo Campo'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="nome" className="block text-sm font-bold text-white mb-1">
            Nome do Campo *
          </label>
          <Input
            className="bg-transparent border-white text-white placeholder:text-gray-200"
            id="nome"
            name="nome"
            value={formData.nome || ''}
            onChange={handleInputChange}
            placeholder="Ex: Campo Principal"
            required
          />
        </div>

        <div>
          <label htmlFor="descricao" className="block text-sm font-bold text-white mb-1">
            Descrição
          </label>
          <Textarea
            className="bg-transparent border-white text-white placeholder:text-gray-200"
            id="descricao"
            name="descricao"
            value={formData.descricao || ''}
            onChange={handleInputChange}
            rows={3}
            placeholder="Descreva as características principais do campo"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tipo" className="block text-sm font-bold text-white mb-1">
              Tipo de Campo
            </label>
            <Select 
              value={formData.tipo} 
              onValueChange={(value) => handleSelectChange('tipo', value as FieldType)}
            >
              <SelectTrigger className="bg-transparent border-white text-white">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="campo_aberto">Campo Aberto</SelectItem>
                <SelectItem value="estufa">Estufa</SelectItem>
                <SelectItem value="vinha">Vinha</SelectItem>
                <SelectItem value="olival">Olival</SelectItem>
                <SelectItem value="pomar">Pomar</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="tipoSolo" className="block text-sm font-bold text-white mb-1">
              Tipo de Solo
            </label>
            <Select 
              value={formData.tipoSolo} 
              onValueChange={(value) => handleSelectChange('tipoSolo', value as SoilType)}
            >
              <SelectTrigger className="bg-transparent border-white text-white">
                <SelectValue placeholder="Selecione o tipo de solo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arenoso">Arenoso</SelectItem>
                <SelectItem value="argiloso">Argiloso</SelectItem>
                <SelectItem value="humoso">Humoso</SelectItem>
                <SelectItem value="misto">Misto</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="area" className="block text-sm font-bold text-white mb-1">
              Área (hectares)
            </label>
            <Input
            className="bg-transparent border-white text-white placeholder:text-gray-200"
              id="area"
              name="area"
              type="number"
              step="0.01"
              min="0"
              value={formData.area || ''}
              onChange={handleInputChange}
              placeholder="Ex: 10.5"
            />
          </div>

          <div>
            <label htmlFor="capacidadeIrrigacao" className="block text-sm font-bold text-white mb-1">
              Capacidade de Irrigação (m³/h)
            </label>
            <Input
            className="bg-transparent border-white text-white placeholder:text-gray-200"
              id="capacidadeIrrigacao"
              name="capacidadeIrrigacao"
              type="number"
              step="0.1"
              min="0"
              value={formData.capacidadeIrrigacao || ''}
              onChange={handleInputChange}
              placeholder="Ex: 5.2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="observacoes" className="block text-sm font-bold text-white mb-1">
            Observações
          </label>
          <Textarea
            className="bg-transparent border-white text-white placeholder:text-gray-200"
            id="observacoes"
            name="observacoes"
            value={formData.observacoes || ''}
            onChange={handleInputChange}
            rows={3}
            placeholder="Informações adicionais sobre o campo"
          />
        </div>

        <div className="flex justify-start space-x-4 pt-4">
          <Button
            type="button"
            onClick={() => navigate('/campos')}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full max-w-[150px] py-2"
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            className="bg-white/95 hover:bg-gray-100 text-black font-medium rounded-full max-w-[200px] py-2"
          >
            {isEditing ? 'Atualizar Campo' : 'Adicionar Campo'}
          </Button>
        </div>
      </form>
    </div>
  );
}

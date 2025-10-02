import { useState, useEffect } from 'react';
import { pessoaService } from '@/services/pessoa/PessoaService';
import { Pessoa } from '@/types/pessoa';
export function usePessoa() {
  const [pessoa, setPessoa] = useState<Pessoa | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchPessoa() {
      setLoading(true);
      const perfil = await pessoaService.getMyPessoa();
      setPessoa(perfil);
      setLoading(false);
    }
    fetchPessoa();
  }, []);
  return { pessoa, loading, setPessoa };
}

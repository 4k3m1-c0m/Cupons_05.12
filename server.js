const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Rota teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'API rodando!' });
});

// GET - Buscar todos os cupons
app.get('/cupons', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cupons')
      .select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// GET - Buscar cupom por ID
app.get('/cupons/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cupons')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// POST - Criar novo cupom
app.post('/cupons', async (req, res) => {
  try {
    const { codigo, desconto_percentual, ativo, validade } = req.body;
    const { data, error } = await supabase
      .from('cupons')
      .insert([{ codigo, desconto_percentual, ativo, validade }])
      .select();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// PUT - Atualizar cupom
app.put('/cupons/:id', async (req, res) => {
  try {
    const { codigo, desconto_percentual, ativo, validade } = req.body;
    const { data, error } = await supabase
      .from('cupons')
      .update({  codigo, desconto_percentual, ativo, validade })
      .eq('id', req.params.id)
      .select();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// DELETE - Deletar cupom
app.delete('/cupons/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('cupons')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ mensagem: 'Cupom deletado' });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
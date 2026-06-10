// storage.js - funções de acesso ao localStorage

// pega lista de clientes
function getClientes() {
    var dados = localStorage.getItem('clientes');
    if (dados) return JSON.parse(dados);
    return [];
}

// salva lista de clientes
function salvarClientes(lista) {
    localStorage.setItem('clientes', JSON.stringify(lista));
}

// adiciona novo cliente, retorna erro se email já existe
function addCliente(nome, email, cpf, senha) {
    var clientes = getClientes();

    var jaExiste = clientes.find(function(c) { return c.email === email; });
    if (jaExiste) return { ok: false, erro: 'Este e-mail já está cadastrado.' };

    var numero = clientes.length + 1;
    var id = 'C' + String(numero).padStart(3, '0');

    var cliente = { id: id, nome: nome, email: email, cpf: cpf, senha: senha };
    clientes.push(cliente);
    salvarClientes(clientes);

    return { ok: true, cliente: cliente };
}

// edita dados de um cliente pelo id
function editarCliente(id, novosDados) {
    var clientes = getClientes();
    var indice = -1;
    for (var i = 0; i < clientes.length; i++) {
        if (clientes[i].id === id) { indice = i; break; }
    }
    if (indice === -1) return { ok: false, erro: 'Cliente não encontrado.' };

    clientes[indice].nome  = novosDados.nome  || clientes[indice].nome;
    clientes[indice].email = novosDados.email || clientes[indice].email;
    clientes[indice].cpf   = novosDados.cpf   || clientes[indice].cpf;
    if (novosDados.senha) clientes[indice].senha = novosDados.senha;

    salvarClientes(clientes);
    return { ok: true, cliente: clientes[indice] };
}

// busca clientes pelo termo digitado
function buscarClientes(termo) {
    var t = termo.toLowerCase();
    return getClientes().filter(function(c) {
        return c.nome.toLowerCase().includes(t)  ||
               c.email.toLowerCase().includes(t) ||
               c.id.toLowerCase().includes(t)    ||
               c.cpf.includes(t);
    });
}

// ----- COMPRAS -----

function getCompras() {
    var dados = localStorage.getItem('compras');
    if (dados) return JSON.parse(dados);
    return [];
}

function salvarCompras(lista) {
    localStorage.setItem('compras', JSON.stringify(lista));
}

function addCompra(clienteId, produtos, total) {
    var compras = getCompras();

    var numero = compras.length + 1;
    var id = 'CP' + String(numero).padStart(3, '0');

    var data = new Date().toLocaleDateString('pt-BR');

    var compra = { id: id, clienteId: clienteId, produtos: produtos, total: total, data: data };
    compras.push(compra);
    salvarCompras(compras);

    return { ok: true, compra: compra };
}

function buscarCompras(termo) {
    var t = termo.toLowerCase();
    var clientes = getClientes();

    return getCompras().filter(function(c) {
        var cliente = clientes.find(function(cl) { return cl.id === c.clienteId; });
        var nomeCliente = cliente ? cliente.nome.toLowerCase() : '';
        var produtos = c.produtos.map(function(p) { return p.nome.toLowerCase(); }).join(' ');

        return c.id.toLowerCase().includes(t)  ||
               nomeCliente.includes(t)          ||
               c.data.includes(t)               ||
               String(c.total).includes(t)      ||
               produtos.includes(t);
    });
}

// ----- CARRINHO -----

function getCarrinho() {
    var dados = localStorage.getItem('carrinho');
    if (dados) return JSON.parse(dados);
    return [];
}

function salvarCarrinho(lista) {
    localStorage.setItem('carrinho', JSON.stringify(lista));
}

function addCarrinho(produto) {
    var carrinho = getCarrinho();
    var indice = -1;
    for (var i = 0; i < carrinho.length; i++) {
        if (carrinho[i].id === produto.id) { indice = i; break; }
    }

    if (indice > -1) {
        carrinho[indice].quantidade += 1;
    } else {
        produto.quantidade = 1;
        carrinho.push(produto);
    }
    salvarCarrinho(carrinho);
}

function removerCarrinho(produtoId) {
    var carrinho = getCarrinho().filter(function(i) { return i.id !== produtoId; });
    salvarCarrinho(carrinho);
}

function alterarQuantidade(produtoId, delta) {
    var carrinho = getCarrinho();
    for (var i = 0; i < carrinho.length; i++) {
        if (carrinho[i].id === produtoId) {
            carrinho[i].quantidade += delta;
            if (carrinho[i].quantidade <= 0) {
                carrinho.splice(i, 1);
            }
            break;
        }
    }
    salvarCarrinho(carrinho);
}

function limparCarrinho() {
    localStorage.removeItem('carrinho');
}

function totalCarrinho() {
    var total = 0;
    getCarrinho().forEach(function(item) {
        total += item.preco * item.quantidade;
    });
    return total;
}

// ----- SESSÃO -----

function getSessao() {
    var dados = localStorage.getItem('sessao');
    if (dados) return JSON.parse(dados);
    return null;
}

function setSessao(cliente) {
    localStorage.setItem('sessao', JSON.stringify(cliente));
}

function removerSessao() {
    localStorage.removeItem('sessao');
}

function estaLogado() {
    return getSessao() !== null;
}

function eAdmin() {
    var s = getSessao();
    return s && s.email === 'admin@kimurastore.com';
}

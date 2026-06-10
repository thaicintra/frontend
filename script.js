// script.js - lógica geral do site

// lista de produtos da loja
var produtos = [
    { id: 'P001', nome: 'Kimono Adulto Branco',   preco: 350.00, imagem: 'img/produto-1.jpg',  descricao: 'Kimono A2 em algodão 100%, ideal para treino e competição.' },
    { id: 'P002', nome: 'Kimono Adulto Azul',      preco: 370.00, imagem: 'img/produto-2.jpg',  descricao: 'Kimono A2 azul royal, aprovado pela IBJJF.' },
    { id: 'P003', nome: 'Kimono Adulto Preto',     preco: 380.00, imagem: 'img/produto-3.jpg',  descricao: 'Kimono A2 preto com reforço nos joelhos.' },
    { id: 'P004', nome: 'Kimono Feminino',         preco: 360.00, imagem: 'img/produto-4.jpg',  descricao: 'Corte especial feminino, tecido leve e resistente.' },
    { id: 'P005', nome: 'Kimono Infantil Branco',  preco: 220.00, imagem: 'img/produto-5.jpg',  descricao: 'Kimono M0 para crianças de 4 a 8 anos.' },
    { id: 'P006', nome: 'Rashguard Manga Longa',   preco: 180.00, imagem: 'img/produto-6.jpg',  descricao: 'Compressão alta, proteção UV, ideal para No-Gi.' },
    { id: 'P007', nome: 'Shorts de Treino',        preco: 120.00, imagem: 'img/produto-7.jpg',  descricao: 'Bermuda MMA com bolsos laterais e elástico reforçado.' },
    { id: 'P008', nome: 'Faixa Branca',            preco:  35.00, imagem: 'img/produto-8.jpg',  descricao: 'Faixa de algodão A2, 4 cm de largura.' },
    { id: 'P009', nome: 'Faixa Azul',              preco:  40.00, imagem: 'img/produto-9.jpg',  descricao: 'Faixa de algodão A2, aprovada pela IBJJF.' },
    { id: 'P010', nome: 'Protetor Bucal Duplo',    preco:  55.00, imagem: 'img/produto-10.jpg', descricao: 'Protetor moldável superior e inferior, com estojo.' },
    { id: 'P011', nome: 'Protetor Bucal Duplo',    preco:  55.00, imagem: 'img/produto-11.jpg', descricao: 'Protetor moldável superior e inferior, com estojo.' },
    { id: 'P012', nome: 'Protetor Bucal Duplo',    preco:  55.00, imagem: 'img/produto-12.jpg', descricao: 'Protetor moldável superior e inferior, com estojo.' },
];

// formata valor em reais
function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ----- MENU CELULAR -----

var MenuItens = document.getElementById('MenuItens');
if (MenuItens) MenuItens.style.maxHeight = '0px';

function menuCelular() {
    if (MenuItens.style.maxHeight == '0px') {
        MenuItens.style.maxHeight = '400px';
    } else {
        MenuItens.style.maxHeight = '0px';
    }
}

// ----- NAVBAR DINÂMICA -----

function atualizarNav() {
    var sessao = getSessao();

    var itensVisitante = document.querySelectorAll('.link-visitante');
    var itensUsuario   = document.querySelectorAll('.link-usuario');
    var itensAdmin     = document.querySelectorAll('.link-admin');

    if (!sessao) {
        itensVisitante.forEach(function(el) { el.style.display = 'inline-block'; });
        itensUsuario.forEach(function(el)   { el.style.display = 'none'; });
        itensAdmin.forEach(function(el)     { el.style.display = 'none'; });
        return;
    }

    itensVisitante.forEach(function(el) { el.style.display = 'none'; });
    itensUsuario.forEach(function(el)   { el.style.display = 'inline-block'; });

    if (eAdmin()) {
        itensAdmin.forEach(function(el) { el.style.display = 'inline-block'; });
    }

    atualizarBadge();
}

function atualizarBadge() {
    var badge = document.getElementById('badge-carrinho');
    if (!badge) return;
    var total = 0;
    getCarrinho().forEach(function(item) { total += item.quantidade; });
    badge.textContent = total > 0 ? '(' + total + ')' : '';
}

// botão sair
var btnSair = document.getElementById('btn-sair');
if (btnSair) {
    btnSair.addEventListener('click', function(e) {
        e.preventDefault();
        removerSessao();
        limparCarrinho();
        window.location.href = 'index.html';
    });
}

// chama ao carregar
atualizarNav();

// ----- CADASTRO -----

function cadastrar() {
    var nome  = document.getElementById('cad-nome')  ? document.getElementById('cad-nome').value.trim()  : null;
    if (nome === null) return;

    var email = document.getElementById('cad-email').value.trim();
    var cpf   = document.getElementById('cad-cpf').value.trim();
    var senha = document.getElementById('cad-senha').value;
    var erro  = document.getElementById('erro-cadastro');

    // validações
    if (!nome || !email || !cpf || !senha) {
        erro.textContent = 'Preencha todos os campos.';
        erro.style.display = 'block';
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        erro.textContent = 'Digite um e-mail válido.';
        erro.style.display = 'block';
        return;
    }

    var cpfNumeros = cpf.replace(/\D/g, '');
    if (cpfNumeros.length !== 11) {
        erro.textContent = 'CPF deve ter 11 dígitos.';
        erro.style.display = 'block';
        return;
    }

    if (senha.length < 6) {
        erro.textContent = 'A senha deve ter pelo menos 6 caracteres.';
        erro.style.display = 'block';
        return;
    }

    var resultado = addCliente(nome, email, cpfNumeros, senha);

    if (!resultado.ok) {
        erro.textContent = resultado.erro;
        erro.style.display = 'block';
        return;
    }

    window.location.href = 'login.html';
}

// ----- LOGIN -----

function fazerLogin() {
    var emailEl = document.getElementById('login-email');
    if (!emailEl) return;

    var email = emailEl.value.trim();
    var senha = document.getElementById('login-senha').value;
    var erro  = document.getElementById('erro-login');

    if (!email || !senha) {
        erro.textContent = 'Preencha e-mail e senha.';
        erro.style.display = 'block';
        return;
    }

    // verificar admin
    if (email === 'admin@kimurastore.com' && senha === 'admin123') {
        setSessao({ id: 'ADMIN', nome: 'Administrador', email: email });
        window.location.href = 'relatorios.html';
        return;
    }

    // verificar clientes
    var clientes = getClientes();
    var cliente = null;
    for (var i = 0; i < clientes.length; i++) {
        if (clientes[i].email === email && clientes[i].senha === senha) {
            cliente = clientes[i];
            break;
        }
    }

    if (!cliente) {
        erro.textContent = 'E-mail ou senha incorretos.';
        erro.style.display = 'block';
        return;
    }

    setSessao(cliente);

    // redireciona para onde estava ou para a loja
    var destino = sessionStorage.getItem('apos-login') || 'loja.html';
    sessionStorage.removeItem('apos-login');
    window.location.href = destino;
}

// ----- CARRINHO (botão nas páginas de produto) -----

function adicionarCarrinho(produtoId) {
    if (!estaLogado()) {
        sessionStorage.setItem('apos-login', 'loja.html');
        window.location.href = 'login.html';
        return;
    }

    var produto = null;
    for (var i = 0; i < produtos.length; i++) {
        if (produtos[i].id === produtoId) { produto = produtos[i]; break; }
    }
    if (!produto) return;

    addCarrinho(produto);
    atualizarBadge();
    alert(produto.nome + ' adicionado ao carrinho!');
}

// ----- PÁGINA DA LOJA -----

function renderizarProdutosLoja() {
    var lista = document.getElementById('lista-produtos');
    if (!lista) return;

    lista.innerHTML = '';

    produtos.forEach(function(p) {
        var div = document.createElement('div');
        div.className = 'col-4';
        div.innerHTML =
            '<img src="' + p.imagem + '" alt="' + p.nome + '">' +
            '<h4>' + p.nome + '</h4>' +
            '<p class="preco">' + formatarPreco(p.preco) + '</p>' +
            '<p style="font-size:12px; color:#777;">' + p.descricao + '</p>' +
            '<button class="btn btn-produto" onclick="adicionarCarrinho(\'' + p.id + '\')">Adicionar ao Carrinho</button>';
        lista.appendChild(div);
    });
}

function renderizarCarrinho() {
    var listaEl    = document.getElementById('lista-carrinho');
    var totalEl    = document.getElementById('total-carrinho');
    var vazioEl    = document.getElementById('carrinho-vazio');
    var itensEl    = document.getElementById('carrinho-itens');
    var avisoEl    = document.getElementById('aviso-login');

    if (!listaEl) return;

    // visitante
    if (!estaLogado()) {
        if (avisoEl)  avisoEl.style.display  = 'block';
        if (itensEl)  itensEl.style.display  = 'none';
        if (vazioEl)  vazioEl.style.display  = 'none';
        return;
    }

    if (avisoEl) avisoEl.style.display = 'none';

    var carrinho = getCarrinho();

    if (carrinho.length === 0) {
        if (vazioEl) vazioEl.style.display = 'block';
        if (itensEl) itensEl.style.display = 'none';
        return;
    }

    if (vazioEl) vazioEl.style.display = 'none';
    if (itensEl) itensEl.style.display = 'block';

    listaEl.innerHTML = '';
    carrinho.forEach(function(item) {
        var tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + item.nome + '</td>' +
            '<td>' +
                '<button class="btn-qtd" onclick="mudarQtd(\'' + item.id + '\', -1)">−</button> ' +
                item.quantidade +
                ' <button class="btn-qtd" onclick="mudarQtd(\'' + item.id + '\', 1)">+</button>' +
            '</td>' +
            '<td>' + formatarPreco(item.preco * item.quantidade) + '</td>' +
            '<td><button class="btn-remover" onclick="tirarItem(\'' + item.id + '\')">✕</button></td>';
        listaEl.appendChild(tr);
    });

    if (totalEl) totalEl.textContent = formatarPreco(totalCarrinho());
}

function mudarQtd(produtoId, delta) {
    alterarQuantidade(produtoId, delta);
    atualizarBadge();
    renderizarCarrinho();
}

function tirarItem(produtoId) {
    removerCarrinho(produtoId);
    atualizarBadge();
    renderizarCarrinho();
}

function finalizarCompra() {
    if (!estaLogado()) {
        window.location.href = 'login.html';
        return;
    }

    var sessao   = getSessao();
    var carrinho = getCarrinho();
    var total    = totalCarrinho();

    var resultado = addCompra(sessao.id, carrinho, total);

    if (resultado.ok) {
        limparCarrinho();
        atualizarBadge();

        document.getElementById('carrinho-itens').style.display = 'none';
        document.getElementById('id-compra').textContent = resultado.compra.id;
        document.getElementById('compra-ok').style.display = 'block';
    }
}

// inicializa loja se estiver na página certa
if (document.getElementById('lista-produtos')) {
    renderizarProdutosLoja();
    renderizarCarrinho();
}

// ----- CONTATO -----

function enviarContato() {
    var nome  = document.getElementById('contato-nome')  ? document.getElementById('contato-nome').value.trim()  : null;
    if (nome === null) return;

    var email = document.getElementById('contato-email').value.trim();
    var msg   = document.getElementById('contato-msg').value.trim();

    if (!nome || !email || !msg) {
        alert('Preencha todos os campos antes de enviar.');
        return;
    }

    document.getElementById('msg-contato').style.display = 'block';
    document.getElementById('form-contato').reset();
}

// ----- RELATÓRIOS -----

function renderizarClientes(lista) {
    var tbody = document.getElementById('lista-clientes');
    var badge = document.getElementById('total-clientes');
    if (!tbody) return;

    if (badge) badge.textContent = lista.length + ' registro' + (lista.length !== 1 ? 's' : '');

    if (lista.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">Nenhum cliente encontrado.</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    lista.forEach(function(c) {
        var cpfFormatado = c.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        var tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + c.id    + '</td>' +
            '<td>' + c.nome  + '</td>' +
            '<td>' + c.email + '</td>' +
            '<td>' + cpfFormatado + '</td>';
        tbody.appendChild(tr);
    });
}

function renderizarCompras(lista) {
    var tbody    = document.getElementById('lista-compras');
    var badge    = document.getElementById('total-compras');
    var clientes = getClientes();
    if (!tbody) return;

    if (badge) badge.textContent = lista.length + ' registro' + (lista.length !== 1 ? 's' : '');

    if (lista.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">Nenhuma compra encontrada.</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    lista.forEach(function(c) {
        var cliente = clientes.find(function(cl) { return cl.id === c.clienteId; });
        var nomeCliente = cliente ? cliente.nome + ' (' + cliente.id + ')' : c.clienteId;
        var listaProdutos = c.produtos.map(function(p) { return p.nome + ' x' + p.quantidade; }).join(', ');

        var tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + c.id             + '</td>' +
            '<td>' + nomeCliente      + '</td>' +
            '<td>' + c.data           + '</td>' +
            '<td>' + listaProdutos    + '</td>' +
            '<td>' + formatarPreco(c.total) + '</td>';
        tbody.appendChild(tr);
    });
}

function filtrarClientes() {
    var termo = document.getElementById('busca-clientes').value.trim();
    var resultado = termo ? buscarClientes(termo) : getClientes();
    renderizarClientes(resultado);
}

function filtrarCompras() {
    var termo = document.getElementById('busca-compras').value.trim();
    var resultado = termo ? buscarCompras(termo) : getCompras();
    renderizarCompras(resultado);
}

// inicializa relatórios
if (document.getElementById('lista-clientes')) {
    // protege a página
    if (!eAdmin()) {
        window.location.href = 'index.html';
    }

    document.getElementById('data-relatorio').textContent = new Date().toLocaleString('pt-BR');
    renderizarClientes(getClientes());
    renderizarCompras(getCompras());
}

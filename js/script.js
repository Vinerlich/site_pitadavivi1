let carrinho = [];
let totalCompra = 0;

// 1. ESTRUTURA DE DADOS: Cada produto com sua própria imagem na pasta img/
const catalogoProdutos = {
    'grid-sobremesas': [
        { nome: 'Pudim de Leite', preco: 75.30, img: 'sobr1.jpg' },
        { nome: 'Ovo de Colher Brigadeiro de Café', preco: 12.00, img: 'OvodeColher .webp' },
        /*{ nome: 'Pavê de Chocolate', preco: 16.00, img: 'pave.jpg' },
        { nome: 'Cheesecake de Frutas Vermelhas', preco: 18.00, img: 'cheesecake.jpg' }*/
    ],
    'grid-caseirinhos': [
        { nome: 'Bolo de Cenoura com Brigadeiro', preco: 37.90, img: 'BoloCenoura.jpg' },
        { nome: 'Bolo Gelado de Coco', preco: 18.00, img: 'BoloGeladoCoco.jpg' },
        { nome: 'Bolo de Fubá na Marmita', preco: 25.00, img: 'bolo-fuba.jpg' }
    ],
    'grid-festa': [
        { nome: 'Bolo Chocolate com Ninho', preco: 167.90, img: 'BolochocolateFesta.jpg' },
        { nome: 'Bolo Red Velvet', preco: 173.80, img: 'RedVelvet.jpg' },
        { nome: 'Naked Cake Frutas Vermelhas', preco: 198.90, img: 'NakedCake.jpg' }
    ],
    'grid-paes': [
        { nome: 'Rosca Creme de Coco', preco: 66.80, img: 'RoscaCoco.jpg' },
        { nome: 'Tranças de Canela e Açúcar', preco: 38.50, img: 'TrancasCanelaAcucar.jpeg' },
        { nome: 'Mini Torta de Frango Cremoso', preco: 21.90, img: 'MiniTorta.webp' }
    ]
};

window.onload = () => {
    setTimeout(() => { 
        const modal = document.getElementById('promo-modal');
        if(modal) modal.style.display = 'block'; 
    }, 1000);
    renderizarCatalogo();
};

function fecharModal() { 
    document.getElementById('promo-modal').style.display = 'none'; 
}

// Gera o HTML buscando a imagem diretamente da pasta 'img/'
function gerarCardHTML(nome, preco, arquivoImagem) {
    return `
        <div class="card">
            <img src="img/${arquivoImagem}" alt="${nome}" class="product-img">
            <h4>${nome}</h4>
            <span class="price">R$ ${preco.toFixed(2).replace('.', ',')}</span>
            <div class="qty-container">
                <label>Qtd: </label>
                <input type="number" value="1" min="1" class="qty-input">
            </div>
            <button class="action-btn" onclick="adicionarAoCarrinho('${nome}', ${preco}, this)">Adicionar</button>
        </div>`;
}

// Renderiza os produtos mapeando a lista individual de cada categoria
function renderizarCatalogo() {
    for (let idGrid in catalogoProdutos) {
        const container = document.getElementById(idGrid);
        if (container) {
            container.innerHTML = ''; // Limpa o container antes de renderizar
            catalogoProdutos[idGrid].forEach(produto => {
                container.innerHTML += gerarCardHTML(produto.nome, produto.preco, produto.img);
            });
        }
    }
}

function adicionarAoCarrinho(nome, preco, botao) {
    const quantidadeInput = botao.parentElement.querySelector('.qty-input');
    const quantidade = parseInt(quantidadeInput.value);
    if (quantidade <= 0 || isNaN(quantidade)) return;
    
    const subtotal = preco * quantidade;
    carrinho.push({ nome, preco, quantidade });
    totalCompra += subtotal;
    
    document.getElementById('cart-count').innerText = carrinho.length;
    document.getElementById('cart-total').innerText = totalCompra.toFixed(2).replace('.', ',');
    
    botao.innerText = "✓ Adicionado";
    botao.style.background = "#27ae60";
    setTimeout(() => { 
        botao.innerText = "Adicionar"; 
        botao.style.background = "#e67e22";
    }, 800);
}

async function buscarCep() {
    const input = document.getElementById('cep-input');
    const cep = input.value.replace(/\D/g, '');
    if (cep.length !== 8) { alert("Digite um CEP válido."); return; }
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await response.json();
        if(dados.erro) throw new Error();
        const freteFixo = 12.00; 
        document.getElementById('shipping-result').innerHTML = `
            <p style="font-size:0.9rem">Entrega para: ${dados.logradouro}</p>
            <p>Frete: <strong>R$ ${freteFixo.toFixed(2).replace('.', ',')}</strong></p>
        `;
    } catch (e) { alert("CEP não encontrado."); }
}

function finalizarCompra() {
    if (carrinho.length === 0) return alert("O carrinho está vazio!");
    let mensagem = "🍰 *Novo Pedido - Pitadavivi*\n\n";
    carrinho.forEach(item => {
        mensagem += `• ${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
    });
    mensagem += `\n*Total:* R$ ${totalCompra.toFixed(2).replace('.', ',')}`;
    
    const link = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
    window.open(link, '_blank');
}
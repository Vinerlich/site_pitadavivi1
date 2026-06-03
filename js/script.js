/* ==========================================================================
   1. ESTADO GLOBAL DA APLICAÇÃO
   ========================================================================== */
let carrinho = [];
let totalCompra = 0;
let valorFrete = 0;

// Catálogo com a estrutura integrada e nomes reais das suas imagens
const catalogoProdutos = {
    'grid-geleias': [
        { nome: 'Geleia de Morango Artesanal', preco: 18.50, img: 'geleia-morango.jpg' }
    ],
    'grid-antepastos': [
        { nome: 'Caponata de Berinjela', preco: 22.00, img: 'caponata.jpg' }
    ],
    'grid-sobremesas': [
        { nome: 'Pudim de Leite', preco: 75.30, img: 'sobr1.jpg' },
        { nome: 'Ovo de Colher Brigadeiro de Café', preco: 12.00, img: 'OvodeColher .webp' }
    ],
    'grid-caseirinhos': [
        { nome: 'Bolo de Cenoura com Brigadeiro', preco: 37.90, img: 'BoloCenoura.jpg' },
        { nome: 'Bolo Gelado de Coco', preco: 18.00, img: 'BoloGeladoCoco.jpg' },
        { nome: 'Bolo de Fubá na Marmita', preco: 25.00, img: 'bolo-fuba.jpg' }
    ],
    'grid-festa': [
        { nome: 'Bolo Chocolate com Ninho', preco: 85.00, img: 'BolochocolateFesta.jpg' },
        { nome: 'Bolo Red Velvet', preco: 90.00, img: 'RedVelvet.jpg' },
        { nome: 'Naked Cake Frutas Vermelhas', preco: 95.00, img: 'NakedCake.jpg' }
    ],
    'grid-paes-doces': [
        { nome: 'Rosca Creme de Coco', preco: 66.80, img: 'RoscaCoco.jpg' },
        { nome: 'Tranças de Canela e Açúcar', preco: 38.50, img: 'TrancasCanelaAcucar.jpeg' }
    ],
    'grid-paes-salgados': [
        { nome: 'Pão de Queijo Recheado', preco: 15.00, img: 'pao-queijo.jpg' }
    ],
    'grid-paes-semgluten': [],
    'grid-tortas-doces': [
        { nome: 'Torta de Limão Sublime', preco: 45.00, img: 'torta-limao.jpg' }
    ],
    'grid-tortas-salgadas': [
        { nome: 'Mini Torta de Frango Cremoso', preco: 21.90, img: 'MiniTorta.webp' }
    ],
    'grid-pascoa': [
        { nome: 'Ovo de Páscoa Crocante', preco: 85.00, img: 'ovo-crocante.jpg' }
    ],
    'grid-dia-das-maes': [],
    'grid-dia-dos-namorados': [],
    'grid-copa-do-mundo': [],
    'grid-dia-dos-pais': [],
    'grid-criancas-professores': [],
    'grid-natal': [
        { nome: 'Panetone Trufado', preco: 65.00, img: 'panetone.jpg' }
    ],
    'grid-ano-novo': []
};

/* ==========================================================================
   2. INICIALIZAÇÃO DA PÁGINA
   ========================================================================== */
window.onload = () => {
    // Exibe o modal de boas-vindas após 1 segundo
    setTimeout(() => { 
        const modal = document.getElementById('promo-modal');
        if(modal) modal.style.display = 'block'; 
    }, 1000);
    
    renderizarCatalogo();
    configurarCliquesSubmenu();
    atualizarInterfaceCarrinho();
};

function fecharModal() { 
    const modal = document.getElementById('promo-modal');
    if(modal) modal.style.display = 'none'; 
}

/* ==========================================================================
   3. ATUALIZAÇÃO DE PREÇO EM TEMPO REAL NO CARD
   ========================================================================== */
function atualizarPrecoCard(inputElement, precoBase) {
    const quantidade = parseInt(inputElement.value) || 1;
    const card = inputElement.closest('.card');
    const priceSpan = card.querySelector('.price');
    const precoCalculado = precoBase * quantidade;
    priceSpan.innerText = `R$ ${precoCalculado.toFixed(2).replace('.', ',')}`;
}

/* ==========================================================================
   4. RENDERIZAÇÃO DINÂMICA DO CATÁLOGO
   ========================================================================== */
function gerarCardHTML(nome, preco, arquivoImagem, eBoloFesta) {
    let seletorHTML = '';
    
    if (eBoloFesta) {
        seletorHTML = `
            <div class="unit-selector">
                <span class="sale-type">Por Quilo (kg)</span>
            </div>`;
    } else {
        seletorHTML = `<div class="unit-selector" style="visibility: hidden; margin: 0; height: 0;"></div>`;
    }

    return `
        <div class="card">
            <img src="img/${arquivoImagem}" alt="${nome}" class="product-img">
            <h4>${nome}</h4>
            ${seletorHTML}
            <div class="price-qty-container">
                <span class="price">R$ ${preco.toFixed(2).replace('.', ',')}</span>
                <input type="number" value="1" min="1" class="qty-input" oninput="atualizarPrecoCard(this, ${preco})">
            </div>
            <button class="action-btn" onclick="adicionarAoCarrinho('${nome}', ${preco}, '${eBoloFesta ? 'Quilo' : 'Unidade'}', this)">Adicionar</button>
        </div>`;
}

function renderizarCatalogo() {
    for (let idGrid in catalogoProdutos) {
        const container = document.getElementById(idGrid);
        if (container) {
            container.innerHTML = '';
            const eBoloFesta = (idGrid === 'grid-festa');
            
            if (catalogoProdutos[idGrid].length > 0) {
                catalogoProdutos[idGrid].forEach(produto => {
                    container.innerHTML += gerarCardHTML(produto.nome, produto.preco, produto.img, eBoloFesta);
                });
            } else {
                container.innerHTML = `<p style="grid-column: 1/-1; color: #777; font-style: italic; padding: 10px;">Em breve novidades nesta categoria!</p>`;
            }
        }
    }
}

/* ==========================================================================
   5. GERENCIAMENTO E INTERFACE DO CARRINHO
   ========================================================================== */
function adicionarAoCarrinho(nome, precoBase, tipoVenda, botao) {
    const card = botao.closest('.card');
    const quantidadeInput = card.querySelector('.qty-input');
    const quantidade = parseInt(quantidadeInput.value);
    
    if (quantidade <= 0 || isNaN(quantidade)) return;

    const itemExistente = carrinho.find(item => item.nome === nome && item.tipo === tipoVenda);

    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({ 
            nome: nome, 
            tipo: tipoVenda,
            preco: precoBase, 
            quantidade: quantidade 
        });
    }
    
    atualizarInterfaceCarrinho();
    
    // Efeito visual de sucesso no botão do card
    botao.innerText = "✓ Adicionado";
    botao.style.background = "#27ae60";
    setTimeout(() => { 
        botao.innerText = "Adicionar"; 
        botao.style.background = ""; // Volta para o padrão do CSS (.action-btn)
    }, 800);
}

function atualizarInterfaceCarrinho() {
    const listaContainer = document.getElementById('cart-items-list');
    const totalCountSpan = document.getElementById('cart-count');
    const totalMoneySpan = document.getElementById('cart-total');
    
    if (!listaContainer) return;

    if (carrinho.length === 0) {
        listaContainer.innerHTML = `<p class="empty-cart-msg">Seu carrinho está vazio.</p>`;
        if (totalCountSpan) totalCountSpan.innerText = '0';
        if (totalMoneySpan) totalMoneySpan.innerText = '0,00';
        totalCompra = 0;
        return;
    }

    let htmlItens = '';
    let totalGeral = 0;
    let totalItensContador = 0;

    carrinho.forEach((item, index) => {
        const subtotalItem = item.preco * item.quantidade;
        totalGeral += subtotalItem;
        totalItensContador += item.quantidade;

        const labelTipo = item.tipo === 'Quilo' ? 'kg' : 'un';

        htmlItens += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed #eee;">
                <div style="flex: 1; padding-right: 10px;">
                    <h5 style="color: #4a302a; font-size: 0.9rem; font-weight: 700;">${item.nome}</h5>
                    <p style="font-size: 0.8rem; color: #666;">${item.quantidade}${labelTipo} x R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <button style="background: #eee; border: none; width: 22px; height: 22px; border-radius: 4px; cursor: pointer; font-weight: bold;" onclick="event.stopPropagation(); alterarQuantidadeDropdown(${index}, -1)">-</button>
                    <span style="font-size: 0.85rem; font-weight: bold; min-width: 15px; text-align: center;">${item.quantidade}</span>
                    <button style="background: #eee; border: none; width: 22px; height: 22px; border-radius: 4px; cursor: pointer; font-weight: bold;" onclick="event.stopPropagation(); alterarQuantidadeDropdown(${index}, 1)">+</button>
                    <button style="background: transparent; border: none; color: #c0392b; cursor: pointer; margin-left: 5px;" onclick="event.stopPropagation(); removerItemDropdown(${index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>`;
    });

    listaContainer.innerHTML = htmlItens;
    totalCompra = totalGeral;
    
    if (totalCountSpan) totalCountSpan.innerText = totalItensContador;
    if (totalMoneySpan) totalMoneySpan.innerText = totalGeral.toFixed(2).replace('.', ',');
}

function alterarQuantidadeDropdown(index, modificador) {
    if (!carrinho[index]) return;
    carrinho[index].quantidade += modificador;
    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }
    atualizarInterfaceCarrinho();
}

function removerItemDropdown(index) {
    if (!carrinho[index]) return;
    carrinho.splice(index, 1);
    atualizarInterfaceCarrinho();
}

/* ==========================================================================
   6. CÁLCULO DE FRETE (ViaCEP)
   ========================================================================== */
async function buscarCep() {
    const input = document.getElementById('cep-input');
    if (!input) return;
    
    const cep = input.value.replace(/\D/g, '');
    if (cep.length !== 8) { alert("Digite um CEP válido com 8 dígitos."); return; }
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await response.json();
        if(dados.erro) throw new Error();
        
        valorFrete = 12.00; // Frete fixo simulado pós-busca bem sucedida
        document.getElementById('shipping-result').innerHTML = `
            <p style="font-size:0.9rem; margin-top:10px; color:#4a302a;">Entrega para: <strong>${dados.logradouro} - ${dados.bairro}</strong></p>
            <p style="color:#27ae60;">Frete: <strong>R$ ${valorFrete.toFixed(2).replace('.', ',')}</strong></p>
        `;
    } catch (e) { 
        alert("CEP não encontrado. Verifique os números digitados."); 
        valorFrete = 0;
    }
}

/* ==========================================================================
   7. FLUXO WHATSAPP & MODAL DE CONFIRMAÇÃO
   ========================================================================== */
function solicitarConfirmacaoCompra() {
    if (carrinho.length === 0) return alert("O carrinho está vazio!");
    
    let mensagem = "🍰 *Novo Pedido - Pitadavivi*\n\n";
    carrinho.forEach(item => {
        const rotuloVenda = item.tipo === 'Quilo' ? 'Kg' : 'Unid.';
        mensagem += `• ${item.quantidade}x ${item.nome} (${rotuloVenda}) - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
    });
    
    mensagem += `\n----------------------------------`;
    mensagem += `\n*Subtotal:* R$ ${totalCompra.toFixed(2).replace('.', ',')}`;
    
    if (valorFrete > 0) {
        mensagem += `\n*Frete:* R$ ${valorFrete.toFixed(2).replace('.', ',')}`;
        mensagem += `\n*Total Geral:* R$ ${(totalCompra + valorFrete).toFixed(2).replace('.', ',')}`;
    } else {
        mensagem += `\n*Total:* R$ ${totalCompra.toFixed(2).replace('.', ',')}`;
        mensagem += `\n_(Frete a combinar na entrega)_`;
    }
    
    const link = `https://wa.me/5511987342562?text=${encodeURIComponent(mensagem)}`;
    window.open(link, '_blank');
    
    const confirmModal = document.getElementById('confirm-modal');
    if (confirmModal) confirmModal.style.display = 'block';
}

function confirmarLimpezaCarrinho(limpar) {
    const confirmModal = document.getElementById('confirm-modal');
    if (confirmModal) confirmModal.style.display = 'none';

    if (limpar) {
        carrinho = [];
        valorFrete = 0;
        
        const shippingResult = document.getElementById('shipping-result');
        const cepInput = document.getElementById('cep-input');
        if (shippingResult) shippingResult.innerHTML = '';
        if (cepInput) cepInput.value = '';
        
        atualizarInterfaceCarrinho();
    }
}

/* ==========================================================================
   8. COMPORTAMENTOS AUXILIARES DE NAVEGAÇÃO E RECURSOS VISUAIS
   ========================================================================== */
function configurarCliquesSubmenu() {
    const linksSubmenu = document.querySelectorAll('.submenu a');
    linksSubmenu.forEach(link => {
        link.addEventListener('click', () => {
            const submenuContainer = link.closest('.submenu');
            if (submenuContainer) {
                // Remove o estilo temporariamente para fechar o menu no mobile/desktop
                submenuContainer.style.display = 'none';
                setTimeout(() => { submenuContainer.style.display = ''; }, 600);
            }
            
            // Otimização para fechar o carrinho se ele estiver aberto junto no mobile
            const wrapper = document.getElementById('cart-wrapper');
            if (wrapper) wrapper.classList.remove('active');
        });
    });
}

function toggleCarrinho(event) {
    event.stopPropagation();
    const wrapper = document.getElementById('cart-wrapper');
    if (wrapper) wrapper.classList.toggle('active');
}

// Fecha o carrinho ao clicar em qualquer lugar fora dele
document.addEventListener('click', (event) => {
    const wrapper = document.getElementById('cart-wrapper');
    if (wrapper && !wrapper.contains(event.target)) {
        wrapper.classList.remove('active');
    }
});
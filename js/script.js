/* ==========================================================================
   1. ESTADO GLOBAL DA APLICAÇÃO E REGRAS INTELIGENTES (SAZONAIS BLINDADOS)
   ========================================================================== */
let carrinho = [];
let totalCompra = 0;
let valorFrete = 0;

const catalogoProdutos = {
    'grid-geleias': [
        { nome: 'Geleia de Amora com manjericão', preco: 18.50, img: 'GeleiaAmora.jpg'},
        { nome: 'Geleia de Damasco Artesanal', preco: 22.00, img: 'GeleiaDamasco.jpg', tag: 'mais_vendido' },
        { nome: 'Geleia de Pimenta Premium', preco: 24.50, img: 'GeleiaPimenta.jpg', tag: 'novidade' }
    ],
    'grid-antepastos': [
        { nome: 'Caponata de Berinjela', preco: 22.00, img: 'caponata.jpg', tag: 'especial' }
    ],
    'grid-sobremesas': [
        { nome: 'Pudim de Leite', preco: 75.30, img: 'sobr1.jpg' },
        { nome: 'Ovo de Colher Brigadeiro de Café', preco: 12.00, img: 'OvodeColher.webp' }
    ],
    'grid-caseirinhos': [
        { nome: 'Bolo de Cenoura com Brigadeiro', preco: 37.90, img: 'BoloCenoura.jpg', tag: 'mais_vendido' },
        { nome: 'Bolo Gelado de Coco', preco: 18.00, img: 'BoloGeladoCoco.jpg' },
        { nome: 'Bolo de Fubá na Marmita', preco: 25.00, img: 'bolo-fuba.jpg' }
    ],
    'grid-festa': [
        { nome: 'Bolo Chocolate com Ninho', preco: 85.00, img: 'BolochocolateFesta.jpg' },
        { nome: 'Bolo Red Velvet', preco: 90.00, img: 'RedVelvet.jpg', tag: 'especial' },
        { nome: 'Naked Cake Frutas Vermelhas', preco: 95.00, img: 'NakedCake.jpg' }
    ],
    'grid-paes-doces': [
        { nome: 'Rosca Creme de Coco', preco: 66.80, img: 'RoscaCoco.jpg', tag: 'mais_vendido' },
        { nome: 'Tranças de Canela e Açúcar', preco: 38.50, img: 'TrancasCanelaAcucar.jpeg' }
    ],
    'grid-paes-salgados': [
        { nome: 'Pão de Queijo Recheado', preco: 15.00, img: 'pao-queijo.jpg', tag: 'novidade' }
    ],
    'grid-paes-semgluten': [],
    'grid-tortas-doces': [
        { nome: 'Torta de Limão Sublime', preco: 45.00, img: 'torta-limao.jpg' }
    ],
    'grid-tortas-salgadas': [
        { nome: 'Mini Torta de Frango Cremoso', preco: 21.90, img: 'MiniTorta.webp' }
    ],

    // CATEGORIAS SAZONAIS (As tags só aparecem quando a seção estiver na época ativa!)
    'grid-pascoa': [
        { nome: 'Ovo de Páscoa Crocante', preco: 85.00, img: 'ovo-crocante.jpg' }
    ],
    'grid-dia-das-maes': [],
    'grid-dia-dos-namorados': [
        { nome: 'Caixa Brigadeiro Gourmet', preco: 32.00, img: 'Brigadeiroscxa6.jpg' }
    ],
    'grid-festa-junina-julina': [
        { nome: 'Kit Estrela de São João', preco: 105.00, img: 'KitSaoJoao.png' },
        { nome: 'Kit Arraiá do Mundo', preco: 135.00, img: 'KitMundo.png' }
    ],
    'grid-copa-do-mundo': [
        { nome: 'Kit Rumo ao Hexa', preco: 95.00, img: 'KitHexa.png' },
        { nome: 'Kit Arraiá do Mundo', preco: 135.00, img: 'KitMundo.png' }
    ],
    'grid-dia-dos-pais': [],
    'grid-criancas-professores': [],
    'grid-natal': [
        { nome: 'Panetone de Pistache', preco: 110.00, img: 'panetonePistache.jpg' },
        { nome: 'Lombo recheado com farofa', preco: 120.00, img: 'Lomborecheado.jpg' }
    ],
    'grid-ano-novo': [
        { nome: 'Pernil assado com Batatas e Cebolas ao Alecrim', preco: 89.00, img: 'PernilaoAlecrim.jpg' }
    ]
};

const rulesSazonais = {
    // 1. DATA MÓVEL
    'grid-pascoa': { tipo: 'movel', chave: 'pascoa', diasAntecedencia: 35, diasDuracaoPos: 1, titulo: 'Páscoa' },
    
    // 2. DATAS DE DOMINGOS MÓVEIS
    'grid-dia-das-maes': { tipo: 'domingo', mes: 4, ordemDomingo: 2, diasAntecedencia: 21, titulo: 'Dia das Mães' }, 
    'grid-dia-dos-pais': { tipo: 'domingo', mes: 7, ordemDomingo: 2, diasAntecedencia: 21, titulo: 'Dia dos Pais' }, 
    
    // 3. DATAS FIXAS
    'grid-dia-dos-namorados': { tipo: 'fixa', mesInicio: 4, diaInicio: 15, mesFim: 5, diaFim: 12, titulo: 'Dia dos Namorados' }, 
    'grid-festa-junina-julina': { tipo: 'fixa', mesInicio: 4, diaInicio: 15, mesFim: 6, diaFim: 31, titulo: 'Festa Junina/Julina' }, 
    'grid-criancas-professores': { tipo: 'fixa', mesInicio: 8, diaInicio: 15, mesFim: 9, diaFim: 15, titulo: 'Crianças e Professores' }, 
    'grid-natal': { tipo: 'fixa', mesInicio: 10, diaInicio: 15, mesFim: 11, diaFim: 25, titulo: 'Natal' }, 
    'grid-ano-novo': { tipo: 'fixa', mesInicio: 10, diaInicio: 15, mesFim: 0, diaFim: 6, titulo: 'Ano Novo' }, 
    'grid-copa-do-mundo': { tipo: 'fixa', mesInicio: 4, diaInicio: 15, mesFim: 7, diaFim: 19, titulo: 'Copa do Mundo' }
};

/* ==========================================================================
   FUNÇÕES AUXILIARES DE CÁLCULO DE CALENDÁRIO DINÂMICO
   ========================================================================== */
function obterDomingoPascoa(ano) {
    const a = ano % 19;
    const b = Math.floor(ano / 100);
    const c = ano % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31);
    const dia = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(ano, mes - 1, dia);
}

function obterDiaDoDomingo(ano, mes, ordem) {
    let data = new Date(ano, mes, 1);
    let contagemDomingos = 0;
    while (data.getMonth() === mes) {
        if (data.getDay() === 0) {
            contagemDomingos++;
            if (contagemDomingos === ordem) {
                return data;
            }
        }
        data.setDate(data.getDate() + 1);
    }
    return null;
}

/* ==========================================================================
   2. INICIALIZAÇÃO DA PÁGINA E MODAIS
   ========================================================================== */
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

window.onload = () => {
    window.scrollTo(0, 0);

    // Só mostra o modal inicial se o usuário ainda NÃO resgatou o mimo
    const mimoResgatado = localStorage.getItem('pitadavivi_mimo_resgatado');
    
    if (mimoResgatado !== 'true') {
        setTimeout(() => {
            const modal = document.getElementById('promo-modal');
            if (modal) {
                modal.classList.add('show');
            }
        }, 1000);
    } else {
        // Se já foi resgatado e pago em uma compra anterior, garante que o botão flutuante comece escondido
        const lembrete = document.getElementById('cupom-lembrete');
        if (lembrete) {
            lembrete.style.display = 'none';
        }
    }

    renderizarCatalogo();
    if (typeof configurarCliquesSubmenu === 'function') configurarCliquesSubmenu();
    if (typeof configurarMenuSanfonaMobile === 'function') configurarMenuSanfonaMobile();
    if (typeof atualizarInterfaceCarrinho === 'function') atualizarInterfaceCarrinho();
    configurarHoverCarrinho();
};

function configurarHoverCarrinho() {
    const cartIcon = document.querySelector('.cart-icon') || document.querySelector('.cart-toggle') || document.getElementById('cart-count')?.parentElement;
    const cartWrapper = document.getElementById('cart-wrapper') || document.querySelector('.cart-container-wrapper');
    const cartBtn = document.getElementById('cart-summary-btn');
    
    if (!cartWrapper) return;

    // 1. COMPORTAMENTO DE HOVER (Apenas para consulta rápida)
    if (cartIcon) {
        cartIcon.addEventListener('mouseenter', () => {
            cartWrapper.classList.add('active');
        });

        cartIcon.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!cartWrapper.classList.contains('locked') && !cartWrapper.matches(':hover') && !cartIcon.matches(':hover')) {
                    cartWrapper.classList.remove('active');
                }
            }, 100);
        });
    }

    cartWrapper.addEventListener('mouseleave', () => {
        if (!cartWrapper.classList.contains('locked')) {
            cartWrapper.classList.remove('active');
        }
    });

    // 2. COMPORTAMENTO DE CLIQUE (Para fixar e interagir)
    const botaoDisparador = cartBtn || cartIcon;
    if (botaoDisparador) {
        botaoDisparador.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            cartWrapper.classList.toggle('locked');
            
            if (cartWrapper.classList.contains('locked')) {
                cartWrapper.classList.add('active');
                cartWrapper.style.boxShadow = "0 4px 20px rgba(74, 48, 42, 0.25)";
            } else {
                cartWrapper.style.boxShadow = "";
                cartWrapper.classList.remove('active');
            }
        });
    }

    // Evita que cliques dentro do próprio carrinho fechem ele
    cartWrapper.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // 3. CLIQUE FORA UNIFICADO: Fecha o carrinho de forma segura sem interferir em menus/submenus
    document.addEventListener('click', (e) => {
        if (cartWrapper.classList.contains('active') || cartWrapper.classList.contains('locked')) {
            // Se o clique NÃO foi no carrinho e NÃO foi no botão do carrinho, aí sim desativa
            if (!cartWrapper.contains(e.target) && (botaoDisparador && !botaoDisparador.contains(e.target))) {
                cartWrapper.classList.remove('active');
                cartWrapper.classList.remove('locked');
                cartWrapper.style.boxShadow = "";
            }
        }
    });
}

function copiarCupom() {
    navigator.clipboard.writeText("QUEROMIMO").then(() => {
        alert("Cupom 'QUEROMIMO' copiado com sucesso! 🎉 É só colar no carrinho para garantir seu mimo.");
        fecharModal();
    }).catch(err => {
        console.error("Erro ao copiar o cupom: ", err);
    });
}

function fecharModal() {
    const modal = document.getElementById('promo-modal');
    const lembrete = document.getElementById('cupom-lembrete');

    if (modal) {
        modal.classList.remove('show');
    }

    // Marca apenas que o modal foi visto para não abrir em cada clique interno,
    // mas não guarda como resgatado no localStorage.
    sessionStorage.setItem('modalMimoVisto', 'true');

    // Sempre mostra o botão flutuante se a compra ainda não tiver sido concluída/paga definitivamente
    const mimoResgatado = localStorage.getItem('pitadavivi_mimo_resgatado');
    if (lembrete && mimoResgatado !== 'true') {
        setTimeout(() => {
            lembrete.classList.add('show');
        }, 300);
    }
}

// Expõe as funções dos modais globalmente
window.copiarCupom = copiarCupom;
window.fecharModal = fecharModal;

/* ==========================================================================
   3. ATUALIZAÇÃO DE PREÇO EM TEMPO REAL NO CARD (INTEGRAÇÃO DIRETA)
   ========================================================================== */
function atualizarPrecoCard(inputElement, precoBase) {
    const quantidade = parseInt(inputElement.value) || 1;
    const card = inputElement.closest('.card');
    if (!card) return;

    const priceSpan = card.querySelector('.price');
    if (priceSpan) {
        const precoCalculado = precoBase * quantidade;
        priceSpan.innerText = `R$ ${precoCalculado.toFixed(2).replace('.', ',')}`;
    }

    const h4Nome = card.querySelector('h4');
    if (h4Nome) {
        const nomeProduto = h4Nome.innerText.trim();
        const itemNoCarrinho = carrinho.find(item => item.nome === nomeProduto);

        if (itemNoCarrinho) {
            itemNoCarrinho.quantidade = quantidade;
            if (typeof atualizarInterfaceCarrinho === 'function') atualizarInterfaceCarrinho();
        }
    }
}
window.atualizarPrecoCard = atualizarPrecoCard;

/* ==========================================================================
   4. RENDERIZAÇÃO DINÂMICA DO CATÁLOGO COM INTELIGÊNCIA SAZONAL (ATUALIZADO)
   ========================================================================== */
function verificarSazonalAtivo(idGrid) {
    const regra = rulesSazonais[idGrid];
    if (!regra) return true;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const anoAtual = hoje.getFullYear();

    if (regra.tipo === 'movel' && regra.chave === 'pascoa') {
        const domingoPascoa = obterDomingoPascoa(anoAtual);
        if (!domingoPascoa) return false;

        const dataInicio = new Date(domingoPascoa);
        dataInicio.setDate(domingoPascoa.getDate() - regra.diasAntecedencia);
        
        const dataFim = new Date(domingoPascoa);
        dataFim.setDate(domingoPascoa.getDate() + regra.diasDuracaoPos);

        return (hoje >= dataInicio && hoje <= dataFim);
    }

    if (regra.tipo === 'domingo') {
        const domingoAlvo = obterDiaDoDomingo(anoAtual, regra.mes, regra.ordemDomingo);
        if (!domingoAlvo) return false;

        const dataInicio = new Date(domingoAlvo);
        dataInicio.setDate(domingoAlvo.getDate() - regra.diasAntecedencia);

        return (hoje >= dataInicio && hoje <= domingoAlvo);
    }

    let dataInicio = new Date(anoAtual, regra.mesInicio, regra.diaInicio, 0, 0, 0, 0);
    let dataFim = new Date(anoAtual, regra.mesFim, regra.diaFim, 23, 59, 59, 999);

    if (regra.mesInicio > regra.mesFim) {
        if (hoje.getMonth() <= regra.mesFim) {
            dataInicio.setFullYear(anoAtual - 1);
        } else {
            dataFim.setFullYear(anoAtual + 1);
        }
    }

    return (hoje >= dataInicio && hoje <= dataFim);
}

function gerarCardHTML(nome, preco, arquivoImagem, eBoloFesta, ehSazonalForaDeEpoca, tagType) {
    let seletorHTML = '';

    if (eBoloFesta) {
        seletorHTML = `<div class="unit-selector"><span class="sale-type">Por Quilo (kg)</span></div>`;
    } else if (ehSazonalForaDeEpoca) {
        seletorHTML = `<div class="unit-selector"><span class="sale-type" style="background: #7f8c8d; color: white;">Portfólio / Eventos</span></div>`;
    } else {
        seletorHTML = `<div class="unit-selector" style="visibility: hidden; margin: 0; height: 0;"></div>`;
    }

    // Configuração com as descrições (title) explicativas e sutis
    const CONFIG_TAGS = {
        mais_vendido: { 
            texto: "Pitada de Amor", 
            icone: "fas fa-heart", 
            corFundo: "rgba(255, 240, 245, 0.95)", 
            corTexto: "#be123c", 
            corBorda: "#fecdd3",
            explicacao: "O queridinho dos nossos clientes e o mais vendido da casa!" 
        },
        novidade: { 
            texto: "Pitada Quentinha", 
            icone: "fas fa-fire-alt", 
            corFundo: "rgba(255, 247, 237, 0.95)", 
            corTexto: "#c2410c", 
            corBorda: "#ffedd5",
            explicacao: "Novidade fresquinha que acabou de chegar ao catálogo!" 
        },
        especial: { 
            texto: "Receita de Coração", 
            icone: "fas fa-star", 
            corFundo: "rgba(253, 242, 248, 0.95)", 
            corTexto: "#db2777", 
            corBorda: "#fce7f3",
            explicacao: "Uma receita exclusiva desenvolvida com muito carinho pela Vivi!" 
        }
    };

    let tagHTML = '';
    if (!ehSazonalForaDeEpoca && tagType && CONFIG_TAGS[tagType]) {
        const tag = CONFIG_TAGS[tagType];
        tagHTML = `
            <span title="${tag.explicacao}" style="
                position: absolute !important;
                top: 10px !important;
                left: 10px !important;
                background-color: ${tag.corFundo} !important;
                color: ${tag.corTexto} !important;
                border: 1px solid ${tag.corBorda} !important;
                padding: 2px 7px !important;
                border-radius: 20px !important;
                font-size: 0.65rem !important;
                font-weight: 700 !important;
                letter-spacing: 0.2px !important;
                box-shadow: 0 2px 5px rgba(74, 48, 42, 0.08) !important;
                z-index: 10 !important;
                font-family: 'Open Sans', sans-serif !important;
                display: inline-flex !important;
                align-items: center !important;
                gap: 4px !important;
                user-select: none !important;
                line-height: 1 !important;
                cursor: help !important;
            ">
                <i class="${tag.icone}" style="font-size: 0.6rem; margin-top: -1px;"></i>
                ${tag.texto}
            </span>`;
    }

    if (ehSazonalForaDeEpoca) {
        return `
            <div class="card" style="opacity: 0.9; border: 1px dashed #bdc3c7;">
                <img src="img/${arquivoImagem}" alt="${nome}" class="product-img" style="filter: grayscale(20%);">
                <h4>${nome}</h4>
                ${seletorHTML}
                <div class="price-qty-container" style="justify-content: center;">
                    <span class="price">Sob Consulta</span>
                </div>
                <button class="action-btn" style="background: #7f8c8d;" onclick="consultarProdutoForaDeEpoca('${nome}')">Consultar Disponibilidade</button>
            </div>`;
    }

    return `
        <div class="card">
            ${tagHTML}
            <img src="img/${arquivoImagem}" alt="${nome}" class="product-img">
            <h4>${nome}</h4>
            ${seletorHTML}
            <div class="price-qty-container">
                <span class="price">R$ ${preco.toFixed(2).replace('.', ',')}</span>
                <input type="number" value="1" min="1" class="qty-input" oninput="atualizarPrecoCard(this, ${preco})">
            </div>
            <button class="action-btn" onclick="adicionarAoCarrinho('${nome}', ${preco}, '${eBoloFesta ? 'Quilo' : 'Unidade'}', this)">Encomendar</button>
        </div>`;
}

function renderizarCatalogo() {
    let containerSazonaisOcultosHTML = '';
    let sectionSazonais = document.getElementById('sazonais');

    // 1. Injeção do Banner de Aviso Geral
    if (!document.getElementById('aviso-encomenda-geral')) {
        const avisoGeral = document.createElement('div');
        avisoGeral.id = 'aviso-encomenda-geral';
        avisoGeral.style.cssText = "margin: 15px auto 25px auto; max-width: 1200px; padding: 15px; background: #fff9f3; border-left: 5px solid #d35400; border-radius: 4px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06); width: 90%; box-sizing: border-box;";
        avisoGeral.innerHTML = `
            <p style="margin: 0; color: #4a302a; font-weight: bold; font-size: 1rem;">
                👩‍🍳 <span style="color: #d35400;">Aviso importante:</span> Trabalhamos exclusivamente sob encomenda! 
                <span style="font-weight: normal; display: block; font-size: 0.9rem; margin-top: 4px; color: #666;">
                    Todos os nossos produtos são produzidos artesanalmente para a data do seu evento. Garanta sua delícia artesanal com antecedência!
                </span>
            </p>
        `;
        const corpoPrincipal = document.querySelector('main');
        if (corpoPrincipal) {
            corpoPrincipal.insertBefore(avisoGeral, corpoPrincipal.firstChild);
        }
    }

    // 1B. INJEÇÃO DOS BOTÕES DE FILTRO DE CATEGORIAS (PITADAVIVI STYLE)
    if (!document.getElementById('container-filtros-topo')) {
        const filtrosWrapper = document.createElement('div');
        filtrosWrapper.id = 'container-filtros-topo';
        filtrosWrapper.style.cssText = "margin: 0 auto 30px auto; max-width: 1200px; width: 90%; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; overflow-x: auto; padding: 5px 0; box-sizing: border-box;";

        const botoesCategorias = [
            { id: 'grid-geleias', nome: '🍓 Geleias' },
            { id: 'grid-antepastos', nome: '🍆 Antepastos' },
            { id: 'grid-sobremesas', nome: '🍮 Sobremesas' },
            { id: 'grid-caseirinhos', nome: '🍞 Caseirinhos' },
            { id: 'grid-festa', nome: '🎂 Bolos de Festa' },
            { id: 'grid-paes-doces', nome: '🥐 Pães Doces' },
            { id: 'grid-paes-salgados', nome: '🥖 Pães Salgados' },
            { id: 'grid-tortas-doces', nome: '🥧 Tortas Doces' },
            { id: 'grid-tortas-salgadas', nome: '🍗 Tortas Salgadas' }
        ];

        let botoesHTML = '';
        botoesCategorias.forEach(cat => {
            if (document.getElementById(cat.id)) {
                botoesHTML += `
                    <button class="filtro-btn" onclick="rolarParaCategoria('${cat.id}')" style="
                        background-color: #fff7ed;
                        color: #c2410c;
                        border: 1px solid #ffedd5;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-family: 'Open Sans', sans-serif;
                        font-size: 0.85rem;
                        font-weight: 700;
                        cursor: pointer;
                        box-shadow: 0 2px 6px rgba(194, 65, 12, 0.04);
                        transition: all 0.2s ease;
                        white-space: nowrap;
                    " onmouseover="this.style.backgroundColor='#ffedd5'; this.style.transform='translateY(-1px)';" onmouseout="this.style.backgroundColor='#fff7ed'; this.style.transform='translateY(0)';">
                        ${cat.nome}
                    </button>
                `;
            }
        });

        if (botoesHTML !== '') {
            filtrosWrapper.innerHTML = botoesHTML;
            const avisoGeral = document.getElementById('aviso-encomenda-geral');
            const corpoPrincipal = document.querySelector('main');
            if (avisoGeral && corpoPrincipal) {
                avisoGeral.insertAdjacentElement('afterend', filtrosWrapper);
            }
        }
    }

    // 2. Loop de varredura do objeto catalogoProdutos
    for (let idGrid in catalogoProdutos) {
        const container = document.getElementById(idGrid);
        if (!container) continue;

        const ehSazonal = idGrid.includes('sazonal') || idGrid.includes('junina') || idGrid.includes('copa') || idGrid.includes('pascoa') || idGrid.includes('natal') || idGrid.includes('ano-novo') || idGrid.includes('namorados') || idGrid.includes('maes') || idGrid.includes('pais') || idGrid.includes('criancas');
        let ativoAtualmente = false;
        
        try {
            if (typeof rulesSazonais !== 'undefined' && rulesSazonais[idGrid]) {
                ativoAtualmente = verificarSazonalAtivo(idGrid);
            }
        } catch (erro) {
            ativoAtualmente = false; 
        }

        if (ehSazonal) {
            const blocoPai = container.closest('.bloco-sazonal-epoca');

            if (ativoAtualmente) {
                if (blocoPai) {
                    blocoPai.style.setProperty('display', 'block', 'important');
                    blocoPai.classList.add('ativo');
                }
                container.innerHTML = '';

                if (catalogoProdutos[idGrid].length > 0) {
                    catalogoProdutos[idGrid].forEach(produto => {
                        container.innerHTML += gerarCardHTML(produto.nome, produto.preco, produto.img, false, false, produto.tag);
                    });
                } else {
                    container.innerHTML = `<p style="grid-column: 1/-1; color: #777; font-style: italic; padding: 10px;">Preparando novidades para esta época!</p>`;
                }
            } else {
                if (blocoPai) {
                    blocoPai.style.setProperty('display', 'none', 'important');
                    blocoPai.classList.remove('ativo');
                }

                if (catalogoProdutos[idGrid] && catalogoProdutos[idGrid].length > 0) {
                    let cardsDoBloco = '';
                    catalogoProdutos[idGrid].forEach(produto => {
                        cardsDoBloco += gerarCardHTML(produto.nome, produto.preco, produto.img, false, true, produto.tag);
                    });

                    let tituloConstruido = idGrid.replace('grid-', '').replace(/-/g, ' ');
                    
                    containerSazonaisOcultosHTML += `
                        <div id="wrapper-oculto-${idGrid}" class="bloco-sazonal-oculto" style="margin-top: 30px; clear: both;">
                            <h4 style="color: #4a302a; border-bottom: 2px solid #e67e22; padding-bottom: 5px; margin-bottom: 15px; text-transform: capitalize; font-size: 1.1rem; text-align: left;">✨ Menu de ${tituloConstruido}</h4>
                            <div class="grid-container" style="display: grid; gap: 20px; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));">${cardsDoBloco}</div>
                        </div>`;
                }
            }
        } else {
            container.innerHTML = '';
            const eBoloFesta = (idGrid === 'grid-festa');

            if (catalogoProdutos[idGrid].length > 0) {
                catalogoProdutos[idGrid].forEach(produto => {
                    container.innerHTML += gerarCardHTML(produto.nome, produto.preco, produto.img, eBoloFesta, false, produto.tag);
                });
            } else {
                container.innerHTML = `<p style="grid-column: 1/-1; color: #777; font-style: italic; padding: 10px;">Em breve novidades!</p>`;
            }
        }
    }

    // 3. Montagem Segura da Galeria Bege no final da Section #sazonais
    const idGaleria = 'portfolio-sazonal-compacto';
    const portfolioAntigo = document.getElementById(idGaleria);
    if (portfolioAntigo) portfolioAntigo.remove();

    if (containerSazonaisOcultosHTML !== '') {
        const portfolioWrapper = document.createElement('div');
        portfolioWrapper.id = idGaleria;
        portfolioWrapper.style.cssText = "margin: 50px auto; padding: 25px; background: #f5f2eb; border-radius: 12px; border: 1px solid #e2dacb; max-width: 1200px; width: 90%; box-sizing: border-box; clear: both; display: block;";

        portfolioWrapper.innerHTML = `
            <div id="ancora-galeria-exclusiva" style="text-align: center; margin-bottom: 20px;">
                <h3><i class="fas fa-images"></i> Galeria de Criações Exclusivas</h3>
                <p style="font-size: 0.9rem; color: #666; font-style: italic; margin-top: 5px;">Inspirações e sabores que marcam época. Produzimos sob encomenda para tornar seu evento inesquecível!</p>
                <button id="btn-toggle-portfolio" style="margin-top: 12px; background: #4a302a; color: white; border: none; padding: 10px 24px; border-radius: 20px; font-weight: bold; cursor: pointer; transition: background 0.3s;">Conhecer Menu Anual Completo</button>
            </div>
            <div id="conteudo-portfolio-oculto" style="display: none; margin-top: 25px;">
                ${containerSazonaisOcultosHTML}
            </div>
        `;

        if (sectionSazonais) {
            sectionSazonais.appendChild(portfolioWrapper);
        } else {
            const principal = document.querySelector('main');
            if (principal) principal.appendChild(portfolioWrapper);
        }

        const btnToggle = document.getElementById('btn-toggle-portfolio');
        if (btnToggle) {
            btnToggle.addEventListener('click', function (e) {
                e.preventDefault();
                const painel = document.getElementById('conteudo-portfolio-oculto');
                if (!painel) return;
                
                if (painel.style.display === 'none' || painel.style.display === '') {
                    painel.style.display = 'block';
                    this.innerText = 'Recolher Menu Anual';
                } else {
                    painel.style.display = 'none';
                    this.innerText = 'Conhecer Menu Anual Completo';
                }
            });
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderizarCatalogo);
} else {
    renderizarCatalogo();
}

function consultarProdutoForaDeEpoca(nomeProduto) {
    const txtMensagem = `Olá Vivi! Estava navegando no seu site e adorei o produto do portfólio: *${nomeProduto}*. Gostaria de saber se há disponibilidade de produção sob encomenda para um evento especial!`;
    const linkWa = `https://wa.me/5511987342562?text=${encodeURIComponent(txtMensagem)}`;
    window.open(linkWa, '_blank');
}
window.consultarProdutoForaDeEpoca = consultarProdutoForaDeEpoca;

function mostrarApenasEpoca(idRecebido) {
    if (!idRecebido) return;

    const idGrid = idRecebido.replace('bloco-', 'grid-');
    const container = document.getElementById(idGrid);
    const ativoAtualmente = verificarSazonalAtivo(idGrid);

    if (ativoAtualmente) {
        if (container) {
            const alvoVisual = container.previousElementSibling || container;
            alvoVisual.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } else {
        const painelOculto = document.getElementById('conteudo-portfolio-oculto');
        const btnToggle = document.getElementById('btn-toggle-portfolio');
        const galeriaHeader = document.getElementById('ancora-galeria-exclusiva');
        
        if (painelOculto && painelOculto.style.display === 'none') {
            painelOculto.style.display = 'block';
            if (btnToggle) btnToggle.innerText = 'Recolher Menu Anual';
        }

        if (galeriaHeader) {
            galeriaHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        const wrapperOculto = document.getElementById(`wrapper-oculto-${idGrid}`);
        if (wrapperOculto) {
            setTimeout(() => {
                wrapperOculto.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }

    const menuLinks = document.querySelector('.menu-links');
    const sidebar = document.querySelector('.sidebar');
    const dropdownItem = document.querySelector('.dropdown-item.open');

    if (menuLinks) menuLinks.classList.remove('open');
    if (sidebar) sidebar.classList.remove('open');
    if (dropdownItem) dropdownItem.classList.remove('open');
}
window.mostrarApenasEpoca = mostrarApenasEpoca;

/* ==========================================================================
   FUNÇÃO AUXILIAR DE NAVEGAÇÃO: ROLAR ATÉ A CATEGORIA FIXA SELECIONADA
   ========================================================================== */
function rolarParaCategoria(idGrid) {
    const container = document.getElementById(idGrid);
    if (container) {
        const tituloSecao = container.previousElementSibling || container;
        tituloSecao.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
window.rolarParaCategoria = rolarParaCategoria;

/* ==========================================================================
   5. GERENCIAMENTO E INTERFACE DO CARRINHO
   ========================================================================== */
function adicionarAoCarrinho(nome, precoBase, tipoVenda, botao) {
    const card = botao.closest('.card');
    if (!card) return;
    const quantidadeInput = card.querySelector('.qty-input');
    const quantidade = parseInt(quantidadeInput.value);

    if (quantidade <= 0 || isNaN(quantidade)) return;

    const itemExistente = carrinho.find(item => item.nome === nome && item.tipo === tipoVenda);

    if (itemExistente) {
        itemExistente.quantidade = quantidade;
    } else {
        // CORRIGIDO: Agora usa "quantidade" perfeitamente em português!
        carrinho.push({ nome: nome, tipo: tipoVenda, preco: precoBase, quantidade: quantidade });
    }

    atualizarInterfaceCarrinho();

    botao.innerText = "✓ Encomendado";
    botao.style.background = "#27ae60";
    setTimeout(() => {
        botao.innerText = "Encomendar";
        botao.style.background = "";
    }, 800);
}

/**
 * Adiciona o Mimo diretamente no seu array global de carrinho "carrinho"
 * Mantém o botão flutuante ativo no site até a conclusão real do pagamento.
 */
function adicionarMimoDireto() {
    const itemMimo = {
        nome: '🎁 Mimo Especial: Doce Artesanal',
        preco: 0.00,
        tipo: 'Unidade', // Ajustado para conversar com seu labelTipo (kg ou un)
        quantidade: 1
    };

    // Garante que a variável carrinho global exista no escopo
    if (typeof carrinho === 'undefined') {
        window.carrinho = [];
    }

    // Escudo protetor: Verifica se o mimo já foi inserido para evitar duplicados
    const jaTemMimo = carrinho.some(item => item.nome === itemMimo.nome);

    if (!jaTemMimo) {
        // Empurra o item de mimo diretamente para o seu array global
        carrinho.push(itemMimo);
        
        // Atualiza a visualização do carrinho usando a sua função
        atualizarInterfaceCarrinho();
        
        alert("🎉 Delícia! Seu mimo exclusivo de primeira compra foi adicionado ao seu carrinho!");
    } else {
        alert("Seu mimo já está garantido no carrinho! 😉");
    }

    // NOTA: Não limpamos o botão ou gravamos no localStorage aqui!
    // Ele só sairá de cena no futuro com a nossa integração de pagamento aprovado.
}

function atualizarInterfaceCarrinho() {
    const listaContainer = document.getElementById('cart-items-list');
    const totalCountSpan = document.getElementById('cart-count');
    const totalMoneySpan = document.getElementById('cart-total');
    
    // Elementos da barra de frete grátis
    const textoFrete = document.getElementById('texto-frete');
    const barraProgresso = document.getElementById('barra-progresso');
    const valorMinimoFreteGratis = 150.00;

    if (!listaContainer) return;

    if (carrinho.length === 0) {
        listaContainer.innerHTML = `<p class="empty-cart-msg">Seu carrinho ainda está vazio... Que tal recheá-lo com nossas delícias? 👩‍🍳</p>`;
        if (totalCountSpan) totalCountSpan.innerText = '0';
        if (totalMoneySpan) totalMoneySpan.innerText = '0,00';
        totalCompra = 0;

        /* --- AJUSTE FRETE GRÁTIS: CARRINHO VAZIO --- */
        if (textoFrete && barraProgresso) {
            barraProgresso.style.width = '0%';
            textoFrete.innerHTML = `Faltam apenas <strong>R$ 150,00</strong> para você ganhar Frete Grátis!`;
        }
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
                    <button style="background: transparent; border: none; color: #c0392b; cursor: pointer; margin-left: 5px;" onclick="event.stopPropagation(); removerItemDropdown(${index})"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>`;
    });

    listaContainer.innerHTML = htmlItens;
    totalCompra = totalGeral;
    if (totalCountSpan) totalCountSpan.innerText = totalItensContador;
    if (totalMoneySpan) totalMoneySpan.innerText = totalGeral.toFixed(2).replace('.', ',');

    /* --- AJUSTE FRETE GRÁTIS: ATUALIZAÇÃO DINÂMICA DO PROGRESSO --- */
    if (textoFrete && barraProgresso) {
        const quantoFalta = valorMinimoFreteGratis - totalGeral;
        const porcentagem = Math.min((totalGeral / valorMinimoFreteGratis) * 100, 100);

        // Define a largura da barra laranja
        barraProgresso.style.width = `${porcentagem}%`;

        // Modifica o texto baseado no valor restante
        if (quantoFalta > 0) {
            textoFrete.innerHTML = `Faltam apenas <strong>R$ ${quantoFalta.toFixed(2).replace('.', ',')}</strong> para você ganhar Frete Grátis!`;
        } else {
            textoFrete.innerHTML = "Parabéns! Você ganhou <strong>Frete Grátis</strong> 🎉";
        }
    }
}

function alterarQuantidadeDropdown(index, modificador) {
    if (!carrinho[index]) return;
    carrinho[index].quantidade += modificador;
    if (carrinho[index].quantidade <= 0) { carrinho.splice(index, 1); }
    atualizarInterfaceCarrinho();
}

function removerItemDropdown(index) {
    if (!carrinho[index]) return;
    carrinho.splice(index, 1);
    atualizarInterfaceCarrinho();
}

// Expõe as funções do carrinho globalmente para o HTML
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.adicionarMimoDireto = adicionarMimoDireto;
window.atualizarInterfaceCarrinho = atualizarInterfaceCarrinho;
window.alterarQuantidadeDropdown = alterarQuantidadeDropdown;
window.removerItemDropdown = removerItemDropdown;

/* ==========================================================================
   6. CÁLCULO DE FRETE (Integração com API Pitadavivi)
   ========================================================================== */
async function buscarCep() {
    const input = document.getElementById('cep-input');
    if (!input) return;

    const cep = input.value.replace(/\D/g, '');
    if (cep.length !== 8) {
        alert("Digite um CEP válido com 8 dígitos.");
        return;
    }

    const resultContainer = document.getElementById('shipping-result');
    if (resultContainer) {
        resultContainer.innerHTML = `<p style="font-size:0.9rem; margin-top:10px; color:#666;">Calculando frete...</p>`;
    }

    const API_URL = "http://localhost:5254/api/frete";

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cepDestino: cep })
        });

        const dados = await response.json();

        if (!response.ok) {
            throw new Error(dados.mensagem || "Erro ao calcular o frete.");
        }

        valorFrete = dados.valorFrete;

        if (resultContainer) {
            resultContainer.innerHTML = `
                <p style="font-size:0.9rem; margin-top:10px; color:#4a302a;">
                    Entrega para: <strong>${dados.logradouroDestino} - ${dados.bairroDestino} (${dados.cidadeDestino})</strong>
                </p>
                <p style="font-size:0.85rem; color:#7f8c8d; margin-bottom:5px;">
                    Distância: <strong>${dados.distanciaKm.toString().replace('.', ',')} km</strong>
                </p>
                <p style="color:#27ae60; font-size:1.1rem;">
                    Frete: <strong>R$ ${valorFrete.toFixed(2).replace('.', ',')}</strong>
                </p>
            `;
        }

    } catch (erro) {
        alert(erro.message);
        if (resultContainer) {
            resultContainer.innerHTML = `<p style="font-size:0.9rem; margin-top:10px; color:#c0392b;">${erro.message}</p>`;
        }
        valorFrete = 0;
    }
}
window.buscarCep = buscarCep;

/* ==========================================================================
   7. FLUXO WHATSAPP & MODAL DE CONFIRMAÇÃO
   ========================================================================== */
function solicitarConfirmacaoCompra() {
    if (carrinho.length === 0) return alert("O carrinho está vazio!");

    let message = "🍰 *Novo Pedido Sob Encomenda - Pitadavivi*\n\n";
    carrinho.forEach(item => {
        const rotuloVenda = item.tipo === 'Quilo' ? 'Kg' : 'Unid.';
        message += `• ${item.quantidade}x ${item.nome} (${rotuloVenda}) - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
    });

    message += `\n----------------------------------`;
    message += `\n*Subtotal:* R$ ${totalCompra.toFixed(2).replace('.', ',')}`;

    if (valorFrete > 0) {
        message += `\n*Frete:* R$ ${valorFrete.toFixed(2).replace('.', ',')}`;
        message += `\n*Total Geral:* R$ ${(totalCompra + valorFrete).toFixed(2).replace('.', ',')}`;
    } else {
        message += `\n*Total:* R$ ${totalCompra.toFixed(2).replace('.', ',')}`;
        message += `\n_(Frete e data de entrega a combinar no WhatsApp)_`;
    }

    const link = `https://wa.me/5511987342562?text=${encodeURIComponent(message)}`;
    window.open(link, '_blank');

    const confirmModal = document.getElementById('confirm-modal');
    if (confirmModal) confirmModal.style.display = 'block';
}
window.solicitarConfirmacaoCompra = solicitarConfirmacaoCompra;

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
window.confirmarLimpezaCarrinho = confirmarLimpezaCarrinho;

/* ==========================================================================
   8. COMPORTAMENTOS AUXILIARES (MENU MOBILE E SUBMENUS - VERSÃO FORÇADA)
   ========================================================================== */

// Função global exigida pelo "onclick" do botão sanduíche do seu HTML
function toggleMenuMobile() {
    const menuLinks = document.getElementById("nav-menu-links");
    if (menuLinks) {
        if (menuLinks.classList.contains("active") || menuLinks.style.display === "flex") {
            menuLinks.classList.remove("active");
            menuLinks.style.display = "";
        } else {
            menuLinks.classList.add("active");
            menuLinks.style.display = "flex";
        }
    }
}

// Fecha tudo e limpa estilos forçados
function fecharMenuAoClicar() {
    const menuLinks = document.getElementById("nav-menu-links");
    if (menuLinks) {
        menuLinks.classList.remove("active");
        menuLinks.style.display = "";
    }
    document.querySelectorAll(".dropdown-item").forEach(item => {
        item.classList.remove("open", "active");
        const sub = item.querySelector(".submenu");
        if (sub) sub.style.display = "";
    });
}

function configurarMenuSanfonaMobile() {
    const menuToggle = document.getElementById("mobile-menu-btn") || document.querySelector(".menu-toggle");
    const menuLinks = document.getElementById("nav-menu-links") || document.querySelector(".menu-links");
    const dropdownItems = document.querySelectorAll(".dropdown-item");

    dropdownItems.forEach(item => {
        const mainBtn = item.querySelector(".blob-btn");
        const subMenu = item.querySelector(".submenu");

        if (mainBtn && subMenu) {
            mainBtn.addEventListener("click", function (e) {
                // Intercepta e mata o comportamento do '#' em qualquer tela
                e.preventDefault();
                e.stopPropagation();

                // Verifica se este submenu específico já está visível
                const jaEstaAberto = subMenu.style.display === "block" || item.classList.contains("open");

                // 1. Fecha TODOS os outros submenus primeiro (Forçado)
                dropdownItems.forEach(otherItem => {
                    otherItem.classList.remove("open", "active");
                    const otherSub = otherItem.querySelector(".submenu");
                    if (otherSub) otherSub.style.display = "none";
                });

                // 2. Abre ou fecha o submenu atual baseado no estado anterior
                if (!jaEstaAberto) {
                    item.classList.add("open", "active");
                    subMenu.style.display = "block"; // Força a exibição ignorando travas do CSS
                } else {
                    item.classList.remove("open", "active");
                    subMenu.style.display = "none";
                }
            });
        }
    });

    // Links diretos (Geleias, Antepastos, etc.) fecham o menu ao clicar
    const linksDiretosMenu = document.querySelectorAll(".menu-links > a, .menu-links > li > a:not(.blob-btn)");
    linksDiretosMenu.forEach(link => {
        link.addEventListener("click", () => {
            fecharMenuAoClicar();
        });
    });

    // Clicar fora fecha a estrutura
    document.addEventListener("click", function (e) {
        if (menuLinks && (menuLinks.classList.contains("active") || menuLinks.style.display === "flex")) {
            if (!menuLinks.contains(e.target) && (!menuToggle || !menuToggle.contains(e.target))) {
                fecharMenuAoClicar();
            }
        }
    });
}

function configurarCliquesSubmenu() {
    const mapeamentoSazonais = {
        "bloco-pascoa": "grid-pascoa",
        "bloco-dia-das-maes": "grid-dia-das-maes",
        "bloco-dia-dos-namorados": "grid-dia-dos-namorados",
        "bloco-festa-junina-julina": "grid-festa-junina-julina",
        "bloco-copa-do-mundo": "grid-copa-do-mundo",
        "bloco-dia-dos-pais": "grid-dia-dos-pais",
        "bloco-criancas-professores": "grid-criancas-professores",
        "bloco-natal": "grid-natal",
        "bloco-ano-novo": "grid-ano-novo"
    };

    const linksSazonais = document.querySelectorAll('.submenu a[href^="javascript:mostrarApenasEpoca"]');
    
    linksSazonais.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const hrefValue = this.getAttribute('href');
            const match = hrefValue.match(/'([^']+)'/);
            if (!match) return;
            
            const blocoId = match[1];
            const containerId = mapeamentoSazonais[blocoId];
            if (!containerId) return;

            let estaAtivo = false;
            try {
                if (typeof verificarSazonalAtivo === 'function') {
                    estaAtivo = verificarSazonalAtivo(containerId);
                }
            } catch (err) {
                estaAtivo = false;
            }

            if (estaAtivo) {
                const gridAlvo = document.getElementById(containerId);
                if (gridAlvo) {
                    gridAlvo.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                const painelOculto = document.getElementById('conteudo-portfolio-oculto');
                const btnToggle = document.getElementById('btn-toggle-portfolio');
                if (painelOculto) {
                    painelOculto.style.display = 'block';
                    if (btnToggle) btnToggle.innerText = 'Recolher Menu Anual';
                }

                const blocoEspecificoOculto = document.getElementById(`wrapper-oculto-${containerId}`);
                if (blocoEspecificoOculto) {
                    setTimeout(() => {
                        blocoEspecificoOculto.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 150);
                } else {
                    const portfolioWrapper = document.getElementById('portfolio-sazonal-compacto');
                    if (portfolioWrapper) {
                        setTimeout(() => {
                            portfolioWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 150);
                    }
                }
            }

            fecharMenuAoClicar();
        });
    });

    const linksNormaisSubmenu = document.querySelectorAll('.submenu a:not([href^="javascript:"])');
    linksNormaisSubmenu.forEach(link => {
        link.addEventListener('click', function() {
            fecharMenuAoClicar();
        });
    });
}

// Inicialização imediata e via evento para garantir execução
configurarMenuSanfonaMobile();
configurarCliquesSubmenu();

document.addEventListener('DOMContentLoaded', function() {
    configurarMenuSanfonaMobile();
    configurarCliquesSubmenu();
});

/* ==========================================================================
   9. CARROSSEL DE DEPOIMENTOS ARTESANAL
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const nextBtn = document.getElementById('next-testimonial');
    const prevBtn = document.getElementById('prev-testimonial');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    const totalItems = cards.length;

    function checarDispositivo() {
        return window.innerWidth <= 768;
    }

    if (checarDispositivo() && dotsContainer) {
        cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                moveSubsecao(index);
            });
            dotsContainer.appendChild(dot);
        });
    }

    function moveSubsecao(index) {
        if (!checarDispositivo()) {
            track.style.transform = 'none';
            return;
        }

        if (index >= totalItems) currentIndex = 0;
        else if (index < 0) currentIndex = totalItems - 1;
        else currentIndex = index;

        const amountToMove = -currentIndex * 100;
        track.style.transform = `translateX(calc(${amountToMove}% - ${currentIndex * 20}px))`;

        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => moveSubsecao(currentIndex + 1));
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => moveSubsecao(currentIndex - 1));
    }

    window.addEventListener('resize', () => {
        if (!checarDispositivo()) {
            track.style.transform = 'none';
        } else {
            moveSubsecao(currentIndex);
        }
    });
});

/* ==========================================================================
   10. BOTÃO VOLTAR AO TOPO - CONFIGURADO PARA APARECER DO MEIO PARA O FIM
   ========================================================================== */
const btnTopo = document.getElementById("btn-topo");

if (btnTopo) {
    const checkScroll = () => {
        // Mede a distância que o usuário já scrollou
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        
        // Calcula a altura total scrollável da página e descobre quanto é a metade dela
        const alturaTotalDocumento = document.documentElement.scrollHeight - window.innerHeight;
        const metadeDaPagina = alturaTotalDocumento / 2;
        
        // Só exibe se o usuário passou da metade da página
        if (scrollTop > metadeDaPagina && alturaTotalDocumento > 300) {
            btnTopo.classList.add("visivel");
        } else {
            btnTopo.classList.remove("visivel");
        }
    };

    window.addEventListener("scroll", checkScroll);
    window.addEventListener("load", checkScroll);

    // Clique limpo e funcional
    btnTopo.addEventListener("click", (e) => {
        e.preventDefault();
        
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
        document.body.scrollTo({ top: 0, behavior: "smooth" });
        
        const mainContainer = document.querySelector('main') || document.querySelector('.wrapper');
        if (mainContainer) {
            mainContainer.scrollTo({ top: 0, behavior: "smooth" });
        }
    });
}

// Garante que o catálogo só seja renderizado DEPOIS que todo o HTML foi lido
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM totalmente carregado. Iniciando renderização...");
    renderizarCatalogo();
});

/* ==========================================================================
   14. FUTURA INTEGRAÇÃO: CONFIRMAÇÃO DE PAGAMENTO (Tarefa do Keep)
   ========================================================================== 
   Esta função será ativada automaticamente pelo gateway de pagamento 
   (Mercado Pago, etc.) assim que o PIX/cartão for aprovado. 
   Ela garante que o mimo seja considerado "usado" definitivamente. */

/*
function confirmarPagamentoSite() {
    // Código para processar o pedido e fechar a venda...
    
    // Agora sim! O pagamento foi confirmado de verdade, então o mimo é "consumido"
    localStorage.setItem('pitadavivi_mimo_resgatado', 'true');
    
    // Opcional: Recarrega ou esconde o botão flutuante se o cliente ainda estiver na página
    const lembrete = document.getElementById('cupom-lembrete');
    if (lembrete) {
        lembrete.style.display = 'none';
    }
}
*/
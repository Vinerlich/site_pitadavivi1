/* ==========================================================================
   1. ESTADO GLOBAL DA APLICAÇÃO
   ========================================================================== */
let carrinho = [];
let totalCompra = 0;
let valorFrete = 0;

const catalogoProdutos = {
    'grid-geleias': [
        { nome: 'Geleia de Amora com manjericão', preco: 18.50, img: 'GeleiaAmora.jpg' },
        { nome: 'Geleia de Damasco Artesanal', preco: 22.00, img: 'GeleiaDamasco.jpg' },
        { nome: 'Geleia de Pimenta Premium', preco: 24.50, img: 'GeleiaPimenta.jpg' }
    ],
    'grid-antepastos': [
        { nome: 'Caponata de Berinjela', preco: 22.00, img: 'caponata.jpg' }
    ],
    'grid-sobremesas': [
        { nome: 'Pudim de Leite', preco: 75.30, img: 'sobr1.jpg' },
        { nome: 'Ovo de Colher Brigadeiro de Café', preco: 12.00, img: 'OvodeColher.webp' }
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

    // CATEGORIAS SAZONAIS
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
    'grid-pascoa': { mesInicio: 2, diaInicio: 1, mesFim: 3, diaFim: 30, titulo: 'Páscoa' },
    'grid-dia-das-maes': { mesInicio: 4, diaInicio: 1, mesFim: 4, diaFim: 15, titulo: 'Dia das Mães' },
    'grid-dia-dos-namorados': { mesInicio: 5, diaInicio: 1, mesFim: 5, diaFim: 15, titulo: 'Dia dos Namorados' },
    'grid-festa-junina-julina': { mesInicio: 5, diaInicio: 1, mesFim: 6, diaFim: 31, titulo: 'Festa Junina/Julina' },
    'grid-copa-do-mundo': { mesInicio: 5, diaInicio: 1, mesFim: 7, diaFim: 19, titulo: 'Copa do Mundo' },
    'grid-dia-dos-pais': { mesInicio: 7, diaInicio: 1, mesFim: 7, diaFim: 15, titulo: 'Dia dos Pais' },
    'grid-criancas-professores': { mesInicio: 9, diaInicio: 1, mesFim: 9, diaFim: 20, titulo: 'Crianças e Professores' },
    'grid-natal': { mesInicio: 9, diaInicio: 15, mesFim: 11, diaFim: 26, titulo: 'Natal' },
    'grid-ano-novo': { mesInicio: 11, diaInicio: 1, mesFim: 0, diaFim: 5, titulo: 'Ano Novo' }
};

/* ==========================================================================
   2. INICIALIZAÇÃO DA PÁGINA
   ========================================================================== */
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

window.onload = () => {
    window.scrollTo(0, 0);

    setTimeout(() => {
        const modal = document.getElementById('promo-modal');
        if (modal) {
            modal.classList.add('show');
        }
    }, 1000);

    renderizarCatalogo();
    configurarCliquesSubmenu();
    configurarMenuSanfonaMobile();
    atualizarInterfaceCarrinho();
    configurarHoverCarrinho();
};

function configurarHoverCarrinho() {
    const cartIcon = document.querySelector('.cart-icon') || document.querySelector('.cart-toggle') || document.getElementById('cart-count')?.parentElement;
    const cartWrapper = document.getElementById('cart-wrapper') || document.querySelector('.cart-container-wrapper');
    
    let carrinhoTravadoAberto = false;

    if (cartIcon && cartWrapper) {
        cartIcon.addEventListener('mouseenter', () => {
            cartWrapper.classList.add('active');
        });

        cartIcon.addEventListener('mouseleave', (e) => {
            setTimeout(() => {
                if (!carrinhoTravadoAberto && !cartWrapper.contains(document.activeElement)) {
                    if (!cartWrapper.matches(':hover') && !cartIcon.matches(':hover')) {
                        cartWrapper.classList.remove('active');
                    }
                }
            }, 100);
        });

        cartWrapper.addEventListener('mouseleave', () => {
            if (!carrinhoTravadoAberto) {
                cartWrapper.classList.remove('active');
            }
        });

        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            carrinhoTravadoAberto = !carrinhoTravadoAberto;
            
            if (carrinhoTravadoAberto) {
                cartWrapper.classList.add('active');
                cartWrapper.style.boxShadow = "0 4px 20px rgba(74, 48, 42, 0.25)";
            } else {
                cartWrapper.style.boxShadow = "";
                cartWrapper.classList.remove('active');
            }
        });

        cartWrapper.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        document.addEventListener('click', (e) => {
            if (carrinhoTravadoAberto) {
                carrinhoTravadoAberto = false;
                if (cartWrapper) {
                    cartWrapper.style.boxShadow = "";
                    cartWrapper.classList.remove('active');
                }
            }
        });
    }
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

    localStorage.setItem('modalMimoVisto', 'true');

    if (lembrete) {
        setTimeout(() => {
            lembrete.classList.add('show');
        }, 300);
    }
}

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
            atualizarInterfaceCarrinho();
        }
    }
}
window.atualizarPrecoCard = atualizarPrecoCard;

/* ==========================================================================
   4. RENDERIZAÇÃO DINÂMICA DO CATÁLOGO COM INTELIGÊNCIA SAZONAL
   ========================================================================== */
function verificarSazonalAtivo(idGrid) {
    if (!rulesSazonais[idGrid]) return true;

    const hoje = new Date();
    const mes = hoje.getMonth();
    const dia = hoje.getDate();
    const regra = rulesSazonais[idGrid];

    if (regra.mesInicio > regra.mesFim) {
        return (mes === regra.mesInicio && dia >= regra.diaInicio) || (mes === regra.mesFim && dia <= regra.diaFim);
    }

    const dInicio = new Date(hoje.getFullYear(), regra.mesInicio, regra.diaInicio);
    const dFim = new Date(hoje.getFullYear(), regra.mesFim, regra.diaFim);
    return hoje >= dInicio && hoje <= dFim;
}

function gerarCardHTML(nome, preco, arquivoImagem, eBoloFesta, ehSazonalForaDeEpoca) {
    let seletorHTML = '';

    if (eBoloFesta) {
        seletorHTML = `<div class="unit-selector"><span class="sale-type">Por Quilo (kg)</span></div>`;
    } else if (ehSazonalForaDeEpoca) {
        seletorHTML = `<div class="unit-selector"><span class="sale-type" style="background: #7f8c8d; color: white;">Portfólio / Eventos</span></div>`;
    } else {
        seletorHTML = `<div class="unit-selector" style="visibility: hidden; margin: 0; height: 0;"></div>`;
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
    const sectionSazonais = document.getElementById('sazonais');

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

        const corpoPrincipal = document.querySelector('main') || document.querySelector('.container') || document.body.firstElementChild;
        if (corpoPrincipal) {
            if (corpoPrincipal.tagName === 'MAIN' || corpoPrincipal.classList.contains('container')) {
                corpoPrincipal.insertBefore(avisoGeral, corpoPrincipal.firstChild);
            } else {
                const headerElement = document.querySelector('header') || document.querySelector('.navbar') || document.querySelector('#header');
                if (headerElement) {
                    headerElement.parentNode.insertBefore(avisoGeral, headerElement.nextSibling);
                } else {
                    document.body.insertBefore(avisoGeral, document.body.firstChild);
                }
            }
        }
    }

    for (let idGrid in catalogoProdutos) {
        const container = document.getElementById(idGrid);
        const ehSazonal = !!rulesSazonais[idGrid];
        const ativoAtualmente = verificarSazonalAtivo(idGrid);

        if (ehSazonal) {
            const h3Titulo = container ? container.previousElementSibling : null;

            if (ativoAtualmente) {
                if (container) {
                    if (h3Titulo) h3Titulo.style.display = 'block';
                    container.style.display = 'grid';
                    container.innerHTML = '';

                    if (catalogoProdutos[idGrid].length > 0) {
                        catalogoProdutos[idGrid].forEach(produto => {
                            container.innerHTML += gerarCardHTML(produto.nome, produto.preco, produto.img, false, false);
                        });
                    } else {
                        container.innerHTML = `<p style="grid-column: 1/-1; color: #777; font-style: italic; padding: 10px;">Preparando novidades para esta época!</p>`;
                    }
                }
            } else {
                if (container) {
                    if (h3Titulo) h3Titulo.style.display = 'none';
                    container.style.display = 'none';
                }

                if (catalogoProdutos[idGrid].length > 0) {
                    let cardsDoBloco = '';
                    catalogoProdutos[idGrid].forEach(produto => {
                        cardsDoBloco += gerarCardHTML(produto.nome, produto.preco, produto.img, false, true);
                    });

                    containerSazonaisOcultosHTML += `
                        <div id="wrapper-oculto-${idGrid}" style="margin-top: 20px;">
                            <h4 style="color: #4a302a; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px;">Menu de ${rulesSazonais[idGrid].titulo}</h4>
                            <div class="grid-container" style="display: grid;">${cardsDoBloco}</div>
                        </div>`;
                }
            }
        } else {
            if (container) {
                container.innerHTML = '';
                const eBoloFesta = (idGrid === 'grid-festa');

                if (catalogoProdutos[idGrid].length > 0) {
                    catalogoProdutos[idGrid].forEach(produto => {
                        container.innerHTML += gerarCardHTML(produto.nome, produto.preco, produto.img, eBoloFesta, false);
                    });
                } else {
                    container.innerHTML = `<p style="grid-column: 1/-1; color: #777; font-style: italic; padding: 10px;">Em breve novidades nesta categoria!</p>`;
                }
            }
        }
    }

    if (sectionSazonais && containerSazonaisOcultosHTML !== '') {
        const portfolioAntigo = document.getElementById('portfolio-sazonal-compacto');
        if (portfolioAntigo) portfolioAntigo.remove();

        const portfolioWrapper = document.createElement('div');
        portfolioWrapper.id = 'portfolio-sazonal-compacto';
        portfolioWrapper.style.cssText = "margin-top: 50px; padding: 25px; background: #f5f2eb; border-radius: 12px; border: 1px solid #e2dacb;";

        portfolioWrapper.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: #4a302a; font-size: 1.4rem; font-weight: bold;"><i class="fas fa-images"></i> Galeria de Criações Exclusivas</h3>
                <p style="font-size: 0.9rem; color: #666; font-style: italic; margin-top: 5px;">Inspirações e sabores que marcam época. Produzimos sob encomenda para tornar seu evento inesquecível!</p>
                <button id="btn-toggle-portfolio" style="margin-top: 12px; background: #4a302a; color: white; border: none; padding: 10px 24px; border-radius: 20px; font-weight: bold; cursor: pointer; transition: background 0.3s;">Conhecer Menu Anual Completo</button>
            </div>
            <div id="conteudo-portfolio-oculto" style="display: none; margin-top: 25px;">
                ${containerSazonaisOcultosHTML}
            </div>
        `;

        sectionSazonais.appendChild(portfolioWrapper);

        const btnToggle = document.getElementById('btn-toggle-portfolio');
        if (btnToggle) {
            btnToggle.addEventListener('click', function () {
                const painel = document.getElementById('conteudo-portfolio-oculto');
                if (!painel) return;
                if (painel.style.display === 'none') {
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

function consultarProdutoForaDeEpoca(nomeProduto) {
    const txtMensagem = `Olá Vivi! Estava navegando no seu site e adorei o produto do portfólio: *${nomeProduto}*. Gostaria de saber se há disponibilidade de produção sob encomenda para um evento especial!`;
    const linkWa = `https://wa.me/5511987342562?text=${encodeURIComponent(txtMensagem)}`;
    window.open(linkWa, '_blank');
}
window.consultarProdutoForaDeEpoca = consultarProdutoForaDeEpoca;

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
window.adicionarAoCarrinho = adicionarAoCarrinho;

function atualizarInterfaceCarrinho() {
    const listaContainer = document.getElementById('cart-items-list');
    const totalCountSpan = document.getElementById('cart-count');
    const totalMoneySpan = document.getElementById('cart-total');

    if (!listaContainer) return;

    if (carrinho.length === 0) {
        listaContainer.innerHTML = `<p class="empty-cart-msg">Seu carrinho ainda está vazio... Que tal recheá-lo com nossas delícias? 👩‍🍳</p>`;
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
                    <button style="background: transparent; border: none; color: #c0392b; cursor: pointer; margin-left: 5px;" onclick="event.stopPropagation(); removerItemDropdown(${index})"><i class="fas fa-trash-alt"></i></button>
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
    if (carrinho[index].quantidade <= 0) { carrinho.splice(index, 1); }
    atualizarInterfaceCarrinho();
}
window.alterarQuantidadeDropdown = alterarQuantidadeDropdown;

function removerItemDropdown(index) {
    if (!carrinho[index]) return;
    carrinho.splice(index, 1);
    atualizarInterfaceCarrinho();
}
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
   8. COMPORTAMENTOS AUXILIARES (MENU MOBILE INTELIGENTE TOTALMENTE CORRIGIDO)
   ========================================================================== */
function configurarMenuSanfonaMobile() {
    const menuToggle = document.querySelector(".menu-toggle");
    const menuLinks = document.querySelector(".menu-links");
    const dropdownItems = document.querySelectorAll(".dropdown-item");

    if (menuToggle && menuLinks) {
        menuToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            menuLinks.classList.toggle("active");
        });
    }

    // 1. CUIDA DOS DROPDOWNS COM/SEM SUBMENU
    dropdownItems.forEach(item => {
        const mainBtn = item.querySelector(".blob-btn");
        const temSubmenu = item.querySelector(".submenu") !== null;

        if (mainBtn) {
            mainBtn.addEventListener("click", function (e) {
                if (window.innerWidth <= 768) {
                    // Se o item do dropdown NÃO possuir um submenu real, fecha tudo e deixa rolar
                    if (!temSubmenu) {
                        if (menuLinks) menuLinks.classList.remove("active");
                        dropdownItems.forEach(otherItem => otherItem.classList.remove("open", "active"));
                        return; 
                    }

                    // Se possuir submenu, aplica o efeito sanfona (abre/fecha o bloco)
                    e.preventDefault();
                    e.stopPropagation();

                    dropdownItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove("open", "active");
                        }
                    });

                    item.classList.toggle("open");
                    item.classList.toggle("active");
                }
            });
        }
    });

    // 2. CORREÇÃO CRÍTICA: Captura qualquer link comum direto no menu que não seja dropdown (Ex: Geleias, Depoimentos, etc)
    const linksDiretosMenu = document.querySelectorAll(".menu-links > a, .menu-links > li > a:not(.blob-btn)");
    linksDiretosMenu.forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768 && menuLinks) {
                menuLinks.classList.remove("active");
                dropdownItems.forEach(item => item.classList.remove("open", "active"));
            }
        });
    });

    // 3. Links internos de dentro dos submenus recolhem o menu todo
    const linksFinaisSubmenu = document.querySelectorAll(".menu-links .submenu a");
    linksFinaisSubmenu.forEach(link => {
        link.addEventListener("click", () => {
            if (menuLinks && menuLinks.classList.contains("active")) {
                menuLinks.classList.remove("active");
                dropdownItems.forEach(item => item.classList.remove("open", "active"));
            }
        });
    });

    // 4. Clicar em qualquer espaço em branco fora do menu também o recolhe
    document.addEventListener("click", function (e) {
        if (menuLinks && menuLinks.classList.contains("active")) {
            if (!menuLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                menuLinks.classList.remove("active");
                dropdownItems.forEach(item => item.classList.remove("open", "active"));
            }
        }
    });
}

function configurarCliquesSubmenu() {
    const linksSazonais = document.querySelectorAll('.sazonal-link, .dropdown-item .submenu a[data-data], .submenu a[data-data]');
    linksSazonais.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const nomeData = this.getAttribute('data-data');

            const mapeamentoContainers = {
                "Páscoa": "grid-pascoa",
                "Dia das Mães": "grid-dia-das-maes",
                "Dia dos Namorados": "grid-dia-dos-namorados",
                "Festa Junina/Julina": "grid-festa-junina-julina",
                "Copa do Mundo": "grid-copa-do-mundo",
                "Dia dos Pais": "grid-dia-dos-pais",
                "Crianças e Professores": "grid-criancas-professores",
                "Natal": "grid-natal",
                "Ano Novo": "grid-ano-novo"
            };

            const containerId = mapeamentoContainers[nomeData];
            if (!containerId) return;
            const estaAtivo = verificarSazonalAtivo(containerId);

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

                const modal = document.getElementById('sazonal-modal');
                const modalTitle = document.getElementById('sazonal-modal-title');
                const modalText = document.getElementById('sazonal-modal-text');

                if (modal && modalTitle && modalText) {
                    modalTitle.innerText = `📅 Especial de ${nomeData}`;
                    modalText.innerHTML = `No momento não estamos na época de <strong>${nomeData}</strong>. <br><br>Mas preparamos tudo sob encomenda para festas! Veja as fotos logo abaixo e fale conosco no WhatsApp.`;
                    modal.style.display = 'block';
                }
            }

            const menuLinks = document.querySelector(".menu-links");
            if (menuLinks) {
                menuLinks.classList.remove("active");
            }
            document.querySelectorAll(".dropdown-item").forEach(item => item.classList.remove("open", "active"));

            const wrapper = document.getElementById('cart-wrapper') || document.querySelector('.cart-container-wrapper');
            if (wrapper) wrapper.classList.remove('active');
        });
    });

    const linksNormais = document.querySelectorAll('.submenu a:not([data-data])');
    linksNormais.forEach(link => {
        link.addEventListener('click', () => {
            const menuLinks = document.querySelector(".menu-links");
            if (menuLinks) {
                menuLinks.classList.remove("active");
            }
            const dropdownItem = link.closest('.dropdown-item');
            if (dropdownItem) dropdownItem.classList.remove('open', 'active');
        });
    });
}

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
   10. BOTÃO VOLTAR AO TOPO - CORREÇÃO DEFINITIVA
   ========================================================================== */
const btnTopo = document.getElementById("btn-topo");

if (btnTopo) {
    // 1. Função que controla a lógica
    const checkScroll = () => {
        if (window.scrollY > 300) {
            btnTopo.style.display = "flex";
        } else {
            btnTopo.style.display = "none";
        }
    };

    // 2. Garante o estado inicial ao carregar a página
    window.addEventListener("load", checkScroll);
    
    // 3. Monitora o scroll
    window.addEventListener("scroll", checkScroll);

    // 4. Ação de clique
    btnTopo.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
/*
 * Projeto: O Sistema de Inventário Arcano de Valdrik
 * Disciplina: Desenvolvimento Web Front-End - 1º Semestre
 * Professor: Heber Castro
 * Aluno: Diogo Cazarotte
 */

// Requisito 1.1/1.2: molde estruturado da classe Item
class Item {
  constructor(id, nome, preco, categoria, quantidade, imagem) {
    this.id = id;
    this.nome = nome;
    this.preco = preco;
    this.categoria = categoria;
    this.quantidade = quantidade;
    this.imagem = imagem;
  }

  // Requisito 1.3: subtotal = preço x quantidade atual
  calcularSubtotal() {
    return this.preco * this.quantidade;
  }
}

// Requisito 1.4: inventário inicial imutável de Valdrik
const inventarioOriginal = [
  new Item(1, "Espada de Aço Valiriano", 500, "Armas", 1, "https://placehold.co/200x200/4d3f7a/e8e6f0?text=Espada"),
  new Item(2, "Escudo de Carvalho", 180, "Armaduras", 4, "https://placehold.co/200x200/4d3f7a/e8e6f0?text=Escudo"),
  new Item(3, "Poção de Cura Maior", 50, "Poções", 10, "https://placehold.co/200x200/8a1f3d/e8e6f0?text=Po%C3%A7%C3%A3o"),
  new Item(4, "Elixir de Mana Azul", 75, "Poções", 2, "https://placehold.co/200x200/1f3d8a/e8e6f0?text=Elixir")
];

// Cópia de trabalho da mochila - inventarioOriginal nunca é alterado
let mochilaAtual = [...inventarioOriginal];
let proximoIdItem = mochilaAtual.length + 1;

// Guarda as dimensões atuais da janela para a trava de proteção (Requisito 4.4)
let larguraJanela = window.innerWidth;
let alturaJanela = window.innerHeight;

// Requisito 3.1: desenha os cards da mochila usando forEach
function desenharMochilaNaTela(itens) {
  const container = document.getElementById("containerItens");
  container.innerHTML = "";

  itens.forEach(function (item) {
    const card = document.createElement("div");
    card.className = "card-item";

    // Requisito 4.1: estoque crítico (menos de 3 unidades) ganha destaque vermelho
    if (item.quantidade < 3) {
      card.classList.add("critico");
    }

    // Requisito 4.2: operador ternário define a tag "ACABANDO!"
    const tagAlerta = item.quantidade < 3 ? '<p class="tag-critico">ACABANDO!</p>' : "";

    card.innerHTML =
      '<div class="moldura-imagem"><img src="' + item.imagem + '" alt="' + item.nome + '"></div>' +
      "<h3>" + item.nome + "</h3>" +
      '<p class="categoria">' + item.categoria + "</p>" +
      "<p>Preço: " + item.preco.toFixed(2) + " moedas</p>" +
      "<p>Quantidade: " + item.quantidade + "</p>" +
      "<p>Subtotal: " + item.calcularSubtotal().toFixed(2) + " moedas</p>" +
      tagAlerta;

    container.appendChild(card);
  });
}

// Requisito 2.1/2.2: cadastro de novos itens via formulário
const formularioCompra = document.getElementById("formularioCompra");

formularioCompra.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nome = document.getElementById("campoNome").value;
  const preco = Number(document.getElementById("campoPreco").value);
  const categoria = document.getElementById("campoCategoria").value;
  const quantidade = Number(document.getElementById("campoQuantidade").value);
  const imagem = document.getElementById("campoImagem").value || "https://placehold.co/200x200/3a2f5c/e8e6f0?text=Item";

  const novoItem = new Item(proximoIdItem, nome, preco, categoria, quantidade, imagem);
  proximoIdItem = proximoIdItem + 1;

  mochilaAtual.push(novoItem);
  desenharMochilaNaTela(mochilaAtual);

  formularioCompra.reset();
});

// Requisito 2.3: sensor de redimensionamento da janela
function atualizarPainelJanela() {
  larguraJanela = window.innerWidth;
  alturaJanela = window.innerHeight;

  document.getElementById("painelJanela").textContent =
    "Janela: " + larguraJanela + "px x " + alturaJanela + "px";
}

window.onresize = atualizarPainelJanela;

// Requisito 3.2: pechincha arcana aplica 10% de desconto via map (não altera o original)
document.getElementById("botaoDesconto").addEventListener("click", function () {
  mochilaAtual = mochilaAtual.map(function (item) {
    return new Item(item.id, item.nome, item.preco * 0.9, item.categoria, item.quantidade, item.imagem);
  });

  desenharMochilaNaTela(mochilaAtual);
});

// Requisito 3.3: visão alquímica filtra apenas itens da categoria "Poções"
document.getElementById("botaoFiltroPocoes").addEventListener("click", function () {
  const pocoes = mochilaAtual.filter(function (item) {
    return item.categoria === "Poções";
  });

  desenharMochilaNaTela(pocoes);
});

// Restaura a exibição completa da mochila
document.getElementById("botaoMostrarTudo").addEventListener("click", function () {
  desenharMochilaNaTela(mochilaAtual);
});

// Requisito 4.3/4.4: contagem de ouro com loop clássico e trava de proteção lógica
document.getElementById("botaoContarOuro").addEventListener("click", function () {
  const resultadoOuro = document.getElementById("resultadoOuro");

  // A magia só funciona se houver itens na mochila E a janela for grande o suficiente
  if (mochilaAtual.length > 0 && larguraJanela > 480) {
    let totalOuro = 0;

    for (let i = 0; i < mochilaAtual.length; i++) {
      totalOuro += mochilaAtual[i].calcularSubtotal();
    }

    resultadoOuro.textContent = "Ouro total na mochila: " + totalOuro.toFixed(2) + " moedas";
    resultadoOuro.className = "resultado-ouro";
  } else {
    resultadoOuro.textContent = "Erro: Tela muito pequena para abrir o baú!";
    resultadoOuro.className = "resultado-ouro critico-texto";
  }
});

// Inicialização do painel
atualizarPainelJanela();
desenharMochilaNaTela(mochilaAtual);

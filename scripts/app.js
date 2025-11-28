// ---- MENU ----
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
menuBtn.onclick = () =>
  (menu.style.display = menu.style.display === "block" ? "none" : "block");

document.querySelectorAll("#menu li").forEach((item) => {
  item.addEventListener("click", () => {
    mostrarTela(item.dataset.section);
    menu.style.display = "none";
  });
});

// ---- TROCA DE TELAS ----
function mostrarTela(id) {
  document
    .querySelectorAll(".tela")
    .forEach((sec) => sec.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
  if (id === "catalogo") listarProdutos();
  if (id === "estoque") listarEstoque();
  if (id === "carrinho") listarCarrinho();
}

// ---- LOGIN SIMPLES ----
function entrar() {
  alert("Login simulado! Redirecionando...");
  mostrarTela("catalogo");
}
function cadastrarUsuario() {
  alert("Usuário cadastrado com sucesso!");
  mostrarTela("catalogo");
}

// ---- PRODUTOS ----
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

function cadastrarProduto() {
  const desc = document.getElementById("desc").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const tipo = document.getElementById("tipo").value;
  const estoque = parseInt(document.getElementById("estoque").value);
  const tamanho = document.getElementById("tamanho").value;
  const imagemInput = document.getElementById("imagem");
  let imgSrc = "";

  if (imagemInput.files && imagemInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imgSrc = e.target.result;
      salvarProduto(desc, valor, tipo, estoque, tamanho, imgSrc);
    };
    reader.readAsDataURL(imagemInput.files[0]);
  } else {
    salvarProduto(
      desc,
      valor,
      tipo,
      estoque,
      tamanho,
      "https://via.placeholder.com/150"
    );
  }
}

function salvarProduto(desc, valor, tipo, estoque, tamanho, imgSrc) {
  produtos.push({ desc, valor, tipo, estoque, tamanho, imgSrc });
  localStorage.setItem("produtos", JSON.stringify(produtos));
  alert("Produto cadastrado com sucesso!");
  mostrarTela("estoque");
}

// ---- LISTAGEM ----
function listarProdutos() {
  const container = document.getElementById("produtos-lista");
  container.innerHTML = "";
  produtos.forEach((p, i) => {
    container.innerHTML += `
      <div class="produto-card" onclick="verDetalhes(${i})">
        <img src="${p.imgSrc}" alt="${p.desc}">
        <h4>${p.desc}</h4>
        <p>R$ ${p.valor.toFixed(2)}</p>
      </div>`;
  });
}

function listarEstoque() {
  const container = document.getElementById("estoque-lista");
  container.innerHTML = "";
  produtos.forEach((p, i) => {
    container.innerHTML += `
      <div>
        <span>${p.desc} - ${p.tamanho}</span>
        <span>Estoque: ${p.estoque}</span>
        <span>R$ ${p.valor.toFixed(2)}</span>
        <button onclick="excluirProduto(${i})">🗑️</button>
      </div>`;
  });
}

function excluirProduto(i) {
  produtos.splice(i, 1);
  localStorage.setItem("produtos", JSON.stringify(produtos));
  listarEstoque();
}

// ---- DETALHES ----
function verDetalhes(i) {
  const p = produtos[i];
  const container = document.getElementById("detalhes-container");
  container.innerHTML = `
    <img src="${p.imgSrc}" style="width:200px;">
    <h3>${p.desc}</h3>
    <p>Tamanho: ${p.tamanho}</p>
    <p>Preço: R$ ${p.valor.toFixed(2)}</p>
    <button onclick="adicionarCarrinho(${i})">Adicionar ao Carrinho</button>
  `;
  mostrarTela("detalhes");
}

function voltarCatalogo() {
  mostrarTela("catalogo");
}

// ---- CARRINHO ----
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function adicionarCarrinho(i) {
  carrinho.push(produtos[i]);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  alert("Produto adicionado ao carrinho!");
}

function listarCarrinho() {
  const container = document.getElementById("carrinho-itens");
  const total = document.getElementById("total");
  container.innerHTML = "";
  let soma = 0;
  carrinho.forEach((p) => {
    soma += p.valor;
    container.innerHTML += `
      <div>
        <span>${p.desc}</span>
        <span>R$ ${p.valor.toFixed(2)}</span>
      </div>`;
  });
  total.innerText = "Total: R$ " + soma.toFixed(2);
}

function finalizarPedido() {
  alert("Pedido finalizado! Obrigado pela compra.");
  carrinho = [];
  localStorage.removeItem("carrinho");
  listarCarrinho();
}

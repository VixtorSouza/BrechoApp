import { initializeApp } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  // Suas credenciais do Firebase vão aqui
  // Substitua pelos valores do seu projeto Firebase
  apiKey: "YOUR_API_KEY",
  authDomain: "brecho-eliane.firebaseapp.com",
  databaseURL: "https://brecho-eliane-default-rtdb.firebaseio.com",
  projectId: "brecho-eliane",
  storageBucket: "brecho-eliane.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX", // Opcional, para o Google Analytics
};

// Inicializa o Firebase
let firebaseApp;

// Tenta inicializar o Firebase
if (!firebaseApp) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
    console.log("Firebase inicializado com sucesso");
  } catch (error) {
    console.error("Erro ao inicializar o Firebase:", error);
  }
}

// Inicializa os serviços
const db = firestore();
const authInstance = auth();

// Configura a persistência offline para o Firestore
db.settings({
  persistence: true,
  cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
});

// Verifica o estado de autenticação
authInstance.onAuthStateChanged((user) => {
  if (user) {
    console.log("Usuário autenticado:", user.email);
  } else {
    console.log("Nenhum usuário autenticado");
  }
});

// Exporta as instâncias e coleções
export { authInstance as auth, db as firestore };
export const usersCollection = db.collection("users");

//creazione dell'interfaccia per definire correttamente come deve essere l'oggetto di tipo Post

export interface Post {
    id: string | null;
    title: string;
    content: string;
    imagePath: string;
}
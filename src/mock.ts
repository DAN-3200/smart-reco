export interface Product {
	id: number;
	name: string;
	price: string;
	rating: number;
	reviews: number;
	confidence: number;
	image: string;
	description: string;
}

export const ProductsListMock: Product[] = [
	{
		id: 4,
		name: 'Teclado Mecânico RGB',
		price: 'R$ 599,00',
		rating: 4.6,
		reviews: 1456,
		confidence: 88,
		image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
		description: 'Switch Cherry MX, iluminação personalizável',
	},
	{
		id: 5,
		name: 'Mouse Gamer Wireless',
		price: 'R$ 349,00',
		rating: 4.5,
		reviews: 2103,
		confidence: 85,
		image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
		description: '16000 DPI, bateria 70h, 6 botões programáveis',
	},
	{
		id: 6,
		name: 'Monitor Ultrawide 34"',
		price: 'R$ 3.299,00',
		rating: 4.7,
		reviews: 734,
		confidence: 82,
		image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
		description: 'WQHD 144Hz, HDR400, curvatura 1800R',
	},
	{
		id: 7,
		name: 'Notebook Performance i7',
		price: 'R$ 5.499,00',
		rating: 4.6,
		reviews: 567,
		confidence: 79,
		image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
		description: '16GB RAM, SSD 512GB, RTX 3050, tela 15.6"',
	},
	{
		id: 8,
		name: 'Tablet Pro 11"',
		price: 'R$ 4.199,00',
		rating: 4.8,
		reviews: 423,
		confidence: 76,
		image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
		description: 'M1 chip, 128GB, Apple Pencil compatível',
	},
];

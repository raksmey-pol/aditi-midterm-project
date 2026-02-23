
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { productService } from "@/lib/services/product.service";
import AddToCartButton from "@/components/AddToCartButton";

interface ProductPageProps {
	params: Promise<{ slug: string }> | { slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
	const { slug } = await Promise.resolve(params);
	const productId = decodeURIComponent(slug);

	if (!productId) {
		notFound();
	}

	let product = null;
	try {
		product = await productService.getProductById(productId);
	} catch {
	}
	if (!product) {
		notFound();
	}

	const imageSrc =
		typeof product.imageUrl === "string" && product.imageUrl.trim() !== ""
			? product.imageUrl
			: "/images/placeholder.png";

	const stockLabel = product.inStock ? "In stock" : "Out of stock";
	const stockVariant = product.inStock ? "default" : "destructive";

	return (
		<main className="container mx-auto px-4 py-8 lg:py-12">
			<div className="mb-6 flex items-center justify-between">
				<Button asChild variant="ghost" size="sm">
					<Link href="/">← Back</Link>
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
				<Card className="overflow-hidden py-0">
					<CardContent className="p-0">
						<div className="relative aspect-square w-full bg-muted/40">
							<Image
								src={imageSrc}
								alt={product.name}
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								unoptimized={imageSrc.startsWith("http")}
								className="object-cover"
								priority
							/>
						</div>
					</CardContent>
				</Card>

				<Card className="h-fit">
					<CardHeader className="space-y-3">
						<div className="flex flex-wrap items-center gap-2">
							<Badge variant="outline">{product.category}</Badge>
							<Badge variant={stockVariant}>{stockLabel}</Badge>
						</div>
						<CardTitle className="text-2xl leading-tight lg:text-3xl">
							{product.name}
						</CardTitle>
						<CardDescription className="text-base leading-7">
							{product.description}
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-5">
						<div className="text-3xl font-bold">${product.price}</div>

						<div className="grid grid-cols-2 gap-4 rounded-lg border p-4 text-sm">
							<div>
								<p className="text-muted-foreground">Product ID</p>
								<p className="font-medium">{product.id}</p>
							</div>
							<div>
								<p className="text-muted-foreground">Stock Quantity</p>
								<p className="font-medium">{product.stockQuantity}</p>
							</div>
							<div>
								<p className="text-muted-foreground">Status</p>
								<p className="font-medium capitalize">{product.status}</p>
							</div>
							<div>
								<p className="text-muted-foreground">Category</p>
								<p className="font-medium">{product.category}</p>
							</div>
						</div>

						<AddToCartButton productId={product.id} inStock={product.inStock} />
					</CardContent>
				</Card>
			</div>
		</main>
	);
}


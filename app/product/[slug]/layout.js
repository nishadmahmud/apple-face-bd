import { getProductById } from '../../../lib/api';

export async function generateMetadata(props) {
    const params = await props.params;
    const slug = typeof params.slug === 'string' ? params.slug : params.slug?.[0] || '';

    let productId = null;
    if (slug) {
        const decoded = decodeURIComponent(slug).trim();
        if (/^\d+$/.test(decoded)) {
            productId = Number(decoded);
        } else {
            const parts = decoded.split('-');
            productId = Number(parts[parts.length - 1]);
        }
    }

    if (!productId || !Number.isFinite(productId) || productId <= 0) {
        return {
            title: 'Product Not Found | Apple Face',
        };
    }

    try {
        const res = await getProductById(productId);
        const product = res?.data || res;

        if (!product || !product.id) {
            return {
                title: 'Product Not Found | Apple Face',
            };
        }

        const title = `${product.name} - Apple Face`;
        const description = product.description
            ? product.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...'
            : `Buy ${product.name} at the best price in Bangladesh from Apple Face.`;

        const images =
            (Array.isArray(product.images) && product.images.length > 0 && product.images) ||
            (Array.isArray(product.imei_image) && product.imei_image.filter(Boolean)) ||
            (product.image_path ? [product.image_path] : []) ||
            ['/og.jpeg'];

        const primaryImage = images[0] || '/og.jpeg';

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: [
                    {
                        url: primaryImage,
                        width: 800,
                        height: 800,
                        alt: product.name,
                    },
                ],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [primaryImage],
            },
        };
    } catch (error) {
        console.error('Failed to generate metadata for product:', error);
        return {
            title: 'Product Details | Apple Face',
        };
    }
}

export default function ProductLayout({ children }) {
    return <>{children}</>;
}

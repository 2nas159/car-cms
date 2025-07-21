"use client";

import { routes } from "@/config/routes";
import { type ClassifiedWithImages, MultiStepFormEnum } from "@/config/types";
import {
	formatColour,
	formatFuelType,
	formatNumber,
	formatOdometerUnit,
	formatPrice,
	formatTransmission,
} from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Cog, Fuel, GaugeCircle, Paintbrush2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HTMLParser } from "../shared/html-parser";
import { Button } from "../ui/button";
import { ImgixImage } from "../ui/imgix-image";
import { FavouriteButton } from "./favourite-button";

interface ClassifiedCardProps {
	classified: ClassifiedWithImages;
	favourites: number[];
}

const getKeyClassifiedInfo = (classified: ClassifiedWithImages) => {
	return [
		{
			id: "odoReading",
			icon: <GaugeCircle className="w-4 h-4" />,
			value: `${formatNumber(classified.odoReading)} ${formatOdometerUnit(classified.odoUnit)}`,
		},
		{
			id: "transmission",
			icon: <Cog className="w-4 h-4" />,
			value: classified?.transmission
				? formatTransmission(classified?.transmission)
				: null,
		},
		{
			id: "fuelType",
			icon: <Fuel className="w-4 h-4" />,
			value: classified?.fuelType ? formatFuelType(classified.fuelType) : null,
		},
		{
			id: "colour",
			icon: <Paintbrush2 className="w-4 h-4" />,
			value: classified?.colour ? formatColour(classified.colour) : null,
		},
	];
};

export const ClassifiedCard = (props: ClassifiedCardProps) => {
	const { classified, favourites } = props;

	const pathname = usePathname();
	const [isFavourite, setIsFavourite] = useState(
		favourites.includes(classified.id),
	);
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		if (!isFavourite && pathname === routes.favourites) setIsVisible(false);
	}, [isFavourite, pathname]);

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.97 }}
					whileHover={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.12)" }}
					transition={{ duration: 0.18 }}
					className="relative rounded-2xl border border-slate-200 bg-white flex flex-col overflow-hidden transition-all duration-200 group"
				>
					<div className="aspect-[4/3] relative bg-slate-100">
						<Link href={routes.singleClassified(classified.slug)}>
							<ImgixImage
								placeholder="blur"
								blurDataURL={classified.images[0]?.blurhash}
								src={classified.images[0]?.src}
								alt={classified.images[0]?.alt}
								className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
								fill={true}
								quality={35}
							/>
						</Link>
						<FavouriteButton
							setIsFavourite={setIsFavourite}
							isFavourite={isFavourite}
							id={classified.id}
						/>
						<div className="absolute top-3 right-4 z-10">
							<span className="inline-block bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg px-4 py-2 rounded-xl text-base font-bold drop-shadow-md">
								{formatPrice({
									price: classified.price,
									currency: classified.currency,
								})}
							</span>
						</div>
					</div>
					<div className="p-5 flex flex-col gap-4 flex-1">
						<div>
							<Link
								href={routes.singleClassified(classified.slug)}
								className="text-lg font-bold line-clamp-1 transition-colors text-black/50 hover:text-primary"
							>
								{classified.title}
							</Link>
							{classified?.description && (
								<div className="text-sm text-gray-500 line-clamp-2 mt-1">
									<HTMLParser html={classified.description} />
								</div>
							)}
						</div>
						<ul className="flex flex-wrap gap-3 bg-slate-50 rounded-lg px-3 py-2 mt-2 mb-2">
							{getKeyClassifiedInfo(classified)
								.filter((v) => v.value)
								.map(({ id, icon, value }) => (
									<li
										key={id}
										className="flex items-center gap-2 text-xs font-medium text-gray-700"
									>
										<span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary">
											{icon}
										</span>
										{value}
									</li>
								))}
						</ul>
						<div className="border-t border-slate-200 pt-4 mt-auto flex flex-col lg:flex-row gap-2">
							<Button
								className="flex-1 font-semibold py-2 text-base bg-primary text-white hover:bg-primary/90 transition-colors"
								asChild
								size="lg"
							>
								<Link
									href={routes.reserve(
										classified.slug,
										MultiStepFormEnum.WELCOME,
									)}
								>
									Reserve
								</Link>
							</Button>
							<Button
								className="flex-1 font-semibold py-2 text-base border border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors"
								asChild
								size="lg"
							>
								<Link href={routes.singleClassified(classified.slug)}>
									View Details
								</Link>
							</Button>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

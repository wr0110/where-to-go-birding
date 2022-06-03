import EbirdLogo from "components/EbirdLogo";

export default function EbirdDescription() {
	return (
		<p className="mb-4">
			<a href="https://ebird.org" target="_blank" rel="noreferrer">
				<EbirdLogo className="border p-4 w-[125px] h-[125px] float-right ml-4 mt-2 mb-4" />
			</a>
			<a href="https://ebird.org" target="_blank" rel="noreferrer">eBird</a> is a real-time, online checklist program that has revolutionized the way that the birding community reports and accesses information about birds. Jointly sponsored by the Laboratory of Ornithology at Cornell University and the National Audubon Society, eBird provides rich data sources for basic information on bird abundance and distribution.
		</p>
	);
}
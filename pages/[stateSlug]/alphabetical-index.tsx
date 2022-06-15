import * as React from "react";
import Link from "next/link";
import { getHotspotsByState } from "lib/mongo";
import { getState } from "lib/localData";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import Heading from "components/Heading";
import Title from "components/Title";

interface Params extends ParsedUrlQuery {
	stateSlug: string,
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { stateSlug } = query as Params;
	const state = getState(stateSlug);
	if (!state) return { notFound: true };
	
	const hotspots = await getHotspotsByState(state.code) || [];
	let activeLetters = hotspots.map((hotspot) => hotspot.name.charAt(0).toUpperCase());
	activeLetters = [...new Set(activeLetters)];

  return {
    props: { stateSlug: state.slug, hotspots, activeLetters },
  }
}

type Props = {
	stateSlug: string,
	activeLetters: string[],
	hotspots: {
		name: string,
		url: string,
	}[],
}

export default function AlphabeticalIndex({ stateSlug, hotspots, activeLetters }: Props) {
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	return (
		<div className="container pb-16 mt-12">
			<Title isOhio={stateSlug === "ohio"}>Alphabetical Index</Title>
			<Heading>Alphabetical Index</Heading>
			<p className="mb-4">
				<i>Tip: Use your browser’s search function to search this page for all or part of the name of a hotspot.
Or click on a letter below to move to that portion of the alphabetical index.</i>
			</p>
			<p className="my-8">
				Also, see <Link href={`/${stateSlug}/roadside-birding`}>Roadside Birding</Link> for hotspots where you may view birds from your vehicle.
			</p>
			<p>
				{alphabet.map(letter => {
					if (activeLetters.includes(letter)) {
						return (
							<Link key={letter} href={`#${letter}`}>
								<a className="inline-block mr-3 text-lg">{letter.toUpperCase()}</a>
							</Link>
						);
					}
					return <span className="inline-block mr-3 text-gray-300 text-lg" key={letter}>{letter}</span>;
				})}
			</p>
			{hotspots.map(({name, url}, i, array) => {
				const prev = i === 0 ? null : array[i-1];
				const showLetter = prev ? name.charAt(0) !== prev.name.charAt(0) : true;
				return (
					<React.Fragment key={name}>
						{showLetter && (
							<h2 id={name[0]} className="font-bold mt-4 mb-2">{name[0].toUpperCase()}</h2>
						)}
						<Link href={url}>{name}</Link><br/>
					</React.Fragment>
				)}
			)}
		</div>
	)
}

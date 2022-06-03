export default function OhioMap() {
	return (
		<>
			<img src="/state-maps/az.jpg" className="w-full" useMap="#Map" alt="Map of Arizona counties" />
			<map name="Map" id="Map">
				<area shape="poly" coords="294,3,293,99,302,101,301,248,307,255,335,233,353,232,353,3,249,4" href="/birding-in-arizona/apache-county" alt="Apache" />
				<area shape="poly" coords="98,106,98,71,141,46,146,4,246,5,248,199,202,191,203,160,192,160,190,151,160,151,149,130,123,126,100,107" href="/birding-in-arizona/coconino-county" alt="Coconino" />
				<area shape="poly" coords="94,199,57,201,45,193,28,170,19,156,21,138,20,110,19,92,17,65,36,64,47,67,59,53,58,2,143,3,138,46,97,68,93,194" href="/birding-in-arizona/mohave-county" alt="Mohave" />
				<area shape="poly" coords="96,217,98,107,123,126,149,130,156,149,186,151,191,163,200,161,204,192,194,206,206,212,206,219,174,216,160,225,123,217,95,217" href="/birding-in-arizona/yavapai-county" alt="Yavapai" />
				<area shape="poly" coords="92,262,96,200,64,201,47,198,30,210,23,219,22,234,23,250,9,259,11,269,12,282,35,287,37,252,54,255,58,262,92,261" href="/birding-in-arizona/la-paz-county" alt="La Paz" />
				<area shape="poly" coords="90,263,56,261,55,255,40,253,37,284,25,284,19,303,13,304,6,313,2,321,90,360,92,264" href="/birding-in-arizona/yuma-county" alt="Yuma" />
				<area shape="poly" coords="156,325,91,327,92,218,155,229,170,218,203,221,214,241,223,245,228,258,196,258,196,276,166,276,158,271,155,325" href="/birding-in-arizona/maricopa-county" alt="Maricopa" />
				<area shape="poly" coords="266,325,161,325,161,272,167,275,198,277,201,259,233,259,244,291,270,277,265,324,270,275" href="/birding-in-arizona/pinal-county" alt="Pinal" />
				<area shape="poly" coords="94,361,96,326,270,327,270,383,229,383,229,395,217,399,214,406,96,363" href="/birding-in-arizona/pima-county" alt="Pima" />
				<area shape="poly" coords="357,414,358,334,272,332,268,412,356,414" href="/birding-in-arizona/cochise-county" alt="Cochise" />
				<area shape="poly" coords="266,411,268,384,229,382,230,396,220,398,213,407,229,416,266,414" href="/birding-in-arizona/santa-cruz-county" alt="Santa Cruz" />
				<area shape="poly" coords="353,329,356,235,334,235,326,242,325,285,342,311,343,324,347,329,354,330" href="/birding-in-arizona/greenlee-county" alt="Greenlee" />
				<area shape="poly" coords="342,332,268,332,269,281,268,269,283,260,293,260,293,255,306,253,324,246,324,286,343,311,340,329" href="/birding-in-arizona/graham-county" alt="Graham" />
				<area shape="poly" coords="246,203,251,220,292,222,294,259,279,261,267,267,269,278,255,286,250,296,232,246,220,243,209,219,209,209,197,209,202,191,245,201" href="/birding-in-arizona/Gila-county" alt="Gila" />
				<area shape="poly" coords="250,4,251,216,293,217,296,248,300,103,291,98,290,4" href="/birding-in-arizona/navajo-county" alt="Navajo" />
  		</map>
		</>
	)
}
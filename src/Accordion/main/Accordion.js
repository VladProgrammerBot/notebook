import { useState, useEffect } from "react";
import AconItem from "../AconItem"

export default ({
	setIsMenuOpen,
	isMenuOpen
}) => {
	const [roadmaps, setRoadmaps] = useState(null);

	const [indexNow, setIndexNow] = useState(18);
	const [levelColors, setLevelColors] = useState(null)

	useEffect(() => {
		const data = localStorage.getItem("roadmap")
		const parse = JSON.parse(data)
		
		if (data) {
			setRoadmaps(parse.roadmap)
			setIndexNow(parse.index)
		} else {
			fetch('./roadmaps.json')
				.then(answer => answer.json())
				.then(data => setRoadmaps(data))
		}

		fetch('./levelColors.json')
			.then(answer => answer.json())
			.then(data => setLevelColors(data))
	}, [])

	useEffect(() => {
		if (roadmaps) {
			localStorage.setItem("roadmap", JSON.stringify( {
				roadmap: roadmaps,
				index: indexNow
			}))
		}
	}, [roadmaps])

	const ChangeFolderName = (id, inputValue) => {
		const newRoadmap = (roadmaps) => {
			return roadmaps.map((roadmap) => {
				if (roadmap.id === id) {
					return {
						...roadmap,
						name: inputValue
					}
				}

				return {
					...roadmap,
					childrens: newRoadmap(roadmap.childrens),
				}
			})
		}

		setRoadmaps(newRoadmap(roadmaps))
	}

	const addFolder = (folderId, value) => {
		const newRoadmap = (roadmaps) => {
			return roadmaps.map((roadmap) => {
				if (roadmap.id === folderId) {
					return {
						...roadmap,
						childrens: [
							...roadmap.childrens,
							{
								id: indexNow,
								isChecked: false,
								isSubChecked: false,
								name: value,
								childrens: []
							}
						]
					}
				}
				return {
					...roadmap,
					childrens: newRoadmap(roadmap.childrens)
				}
			})
		}

		setRoadmaps(newRoadmap(roadmaps))
		setIndexNow(indexNow + 1)
	}

	const removeFolder = (folderId) => {
		const newRoadmap = (roadmaps) => {
			return roadmaps.filter((roadmap) => {
				return roadmap.id !== folderId
			}).map((roadmap) => {
				return {
					...roadmap,
					childrens: newRoadmap(roadmap.childrens)
				}
			})
		}

		setRoadmaps(newRoadmap(roadmaps))
	}

	const toggleMainFolder = (folder) => {
		const newRoadmap = (roadmaps) => {
			return roadmaps.map((roadmap) => {
				if (roadmap.id === folder.id) {
					return {
						...roadmap,
						isMain: !folder.isMain
					}
				}
				return {
					...roadmap,
					childrens: newRoadmap(roadmap.childrens)
				}
			})
		}

		setRoadmaps(newRoadmap(roadmaps))
	}

	return (
		<div>
			{roadmaps?.map((item) => {
				return (
					<AconItem
						key={item.id}
						roadmap={item}
						addFolder={addFolder}
						removeFolder={removeFolder}
						toggleMainFolder={toggleMainFolder}
						level={0}
						levelColors={levelColors}
						isMenuOpen={isMenuOpen}
						setIsMenuOpen={setIsMenuOpen}
						changeFolderName={ChangeFolderName}
					/>
				)
			})}
		</div>
	)
}
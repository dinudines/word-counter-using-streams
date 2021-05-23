const axios = require("axios");

exports.randomNumber = function (length) {
	var text = "";
	var possible = "123456789";
	for (var i = 0; i < length; i++) {
		var sup = Math.floor(Math.random() * possible.length);
		text += i > 0 && sup == i ? "0" : possible.charAt(sup);
	}
	return Number(text);
};

exports.getCount = function(words, wordsWithCounts) {
	words.forEach(word => {
		const trimmedWord = word.trim();
		if(trimmedWord) {
			if(wordsWithCounts.has(trimmedWord)){
				let prevCount = wordsWithCounts.get(trimmedWord);
				wordsWithCounts.set(trimmedWord, prevCount + 1);
			} else {
				wordsWithCounts.set(trimmedWord, 1);
			}
		}
	});
	return wordsWithCounts;
}

const constructDictCall = function(url) {
    return axios.get(url);
}

exports.sortMapByValue = function(customMap) {
	// By descending order
	return new Map([...customMap.entries()].sort((a, b) => b[1] - a[1]));
}

exports.getFirstNItemsOfMap = function(count, customMap) {
	return Array.from(customMap).slice(0, count);
}

exports.getPreResultsAndAPICalls = function(customMap) {
	const preResults = [];
	const apiCalls = [];	
	customMap.forEach(item => {
		preResults.push({
			word: item[0],
			count: item[1],
			url: `${process.env.DICT_BASE_URL}?key=${process.env.DICT_API_KEY}&lang=en-en&text=${item[0]}`
		});
		apiCalls.push(constructDictCall(`${process.env.DICT_BASE_URL}?key=${process.env.DICT_API_KEY}&lang=en-en&text=${item[0]}`));
	});
	return [preResults, apiCalls];
}

exports.formatOutputResponse = function(apiResults, preResults) {
	return apiResults.map((item,index) => {
		return {
			Word: preResults[index].word,
			Output: {
				Occurences: preResults[index].count,
				Synonyms: item.data?.def[0]?.tr.map(i => i.text) || [],
				Pos: item.data?.def[0]?.pos || "-",
			}
		}
	});
}
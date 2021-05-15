export function dashedToCamel(word) {
  return word.split('-').map(function(x,i){
    return (i ? x[0].toUpperCase() : x[0].toLowerCase()) + x.slice(1).toLowerCase();
  }).join('');
}

export function constToCamel(word, upperFirst=false) {
  return word.split('_').map(function(x,i){
    return (i || upperFirst ? x[0].toUpperCase() : x[0].toLowerCase()) + x.slice(1).toLowerCase();
  }).join('');
}
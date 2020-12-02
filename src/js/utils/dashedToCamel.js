export function dashedToCamel(word) {
  return word.split('-').map(function(x,i){
    return (i ? x[0].toUpperCase() : x[0].toLowerCase()) + x.slice(1).toLowerCase();
  }).join('');
}

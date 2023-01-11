/**
 * Написать функцию sostavChisla(massivChisel: number[], chislo: number),
 которая бы находила все возможные комбинации чисел из massivChisel,
 сумма которых равна chislo. При этом:
 1) massivChisel содержит, только уникальные положительные числа (> 0)
 2) в комбинации не должно быть повторений чисел
 3) все комбинации должны быть уникальными

 Для проверки работоспособности функции запустить runTests()

 @param massivChisel: number[]
 @param chislo: number[]
 @return Array<Array<number>>
 */

//My solution
function sostavChisla(massivChisel, chislo) {
    let result = [];
    let start = 0;
    let sum = 0;
    let arr = [];
    function helper(start, arr, sum) {
        if (sum === chislo) {
            result.push(arr);
        } else if (sum < chislo) {
            for (let i = start; i < massivChisel.length; i++) {
                helper(i + 1, arr.concat(massivChisel[i]), sum + massivChisel[i]);
            }
        }
    }
    helper(start, arr, sum);
    return result;
}
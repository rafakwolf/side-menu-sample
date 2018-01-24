$(document).ready(function () {

    $(function () {

        $('#search-menu').keyup(function () {

            var searchText = $(this).val();

            $('ul > li').each(function () {
                var currentLiText = $(this).text().toUpperCase(),
                    showCurrentLi = currentLiText.indexOf(searchText.toUpperCase()) !==
                    -1;

                $(this).toggle(showCurrentLi);
            });
        });

    });
});
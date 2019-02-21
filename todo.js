== Infos a avoir dans la db pour un utilisateur :
1. username
2. firstname
3. lastname
4. email
5. mdp
6. location
7. birthdate
8. genre
9. lookingfor
10. description (long text)
11. tags (soit une str soit 2 nouvelles tables tags (une pour chaque tag et l'autre pour les liens tags/users))
12. popularity (score de popularité)

== Il faudrait aussi une table qui stock les likes, et les profils visités donc des routes :
like -> post
like -> delete
like/:id_user -> get
history -> post
history/:id_user -> get

== Le sujet dit, sur un pofil "Voir si l’utilisateur est en ligne, et si ce n’est pas le cas, afficher la date de sa dernière visite."
A voir comment implementer ca soit faire une table pour les visites, soit le mettre dans la table user

== Une table pour les signalement de faux comptes
"Reporter l’utilisateur comme étant un “faux compte”."

== Une table pour les bloquages
"Bloquer l’utilisateur. Un utilisateur bloqué ne doit plus apparaître dans les résultats de recherche, et ne doit plus génerer de notifications."

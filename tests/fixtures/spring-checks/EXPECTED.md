# What CodeChecks must find here

One finding each, on the line of the wrong case and never on the right one beside it:

| Code | Class.member |
|---|---|
| QUERY_WITHOUT_MODIFYING | Repo.rename |
| JPQL_SELECT_STAR | Repo.all |
| PROPERTY_PLACEHOLDER_SYNTAX | Svc.broken |
| VALUE_WITHOUT_PLACEHOLDER | Svc.literal |
| INJECTION_INTO_STATIC_FIELD | Svc.repo |
| SCHEDULED_METHOD_WITH_PARAMETERS | Svc.tick |
| ASYNC_RETURN_TYPE | Svc.compute |
| BEAN_METHOD_NOT_OVERRIDABLE | Cfg.hidden, Cfg.sealed |
| PATH_VARIABLE_NOT_IN_PATH | Web.one |
| JAVA_TEST_SPRING_EXTENSION | SvcTest |

Fourteen rows in all, with four older checks the same code also trips. Run it by copying this
folder under the world's `data/` tree and passing that folder as `project`.

# What ConfigurationProblems must find here

Five findings, all `high`, and nothing for the nine valid settings beside them:

| Setting | Value | Not |
|---|---|---|
| server.port | 80a | a whole number |
| server.servlet.session.timeout | half an hour | a duration |
| spring.servlet.multipart.max-file-size | ten megabytes | a size |
| spring.main.lazy-initialization | maybe | true or false |
| server.tomcat.max-connections (application.yml) | lots | a whole number |

`spring.application.name` is written twice on purpose: the reader keeps one record per key, so a
duplicate is not yet reported. When it is, this file should say so.

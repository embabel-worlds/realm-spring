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

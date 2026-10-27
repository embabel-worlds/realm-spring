# realm-spring

Your Spring application, explained before anything is changed — free, for every Spring developer.
Point it at a project (a GitHub repository, or a folder of yours) and it reads the code, the build and
the configuration where they live:

- **What it runs on**: Spring Boot, Spring Framework and Java versions, how long the line is supported
  (open-source and commercial, from spring.io), and the newest line.
- **Debt inbox**: every finding, linked to its line, with the fix, the OpenRewrite recipe where one is
  verified, and Spring's documentation — kept as decisions (done, snoozed, won't fix) you work through.
- **Code** Spring has moved past, from a rule catalogue that is data (`reference/rules.yml`): javax →
  jakarta, removed adapters, `@MockBean`, JUnit 4, Jackson 2 under Boot 4, moved test slices, …
- **Configuration**: settings nothing binds (typos), deprecated and removed ones with their replacement —
  checked against the metadata in your own Spring and Spring Cloud jars, with relaxed binding.
- **Upgrade path**: everything a target Spring Boot version breaks, read from that release's own jars,
  and a plan to hand to your coding agent.
- **Vulnerabilities**: one item per vulnerable dependency, with the fix on your own line — and only one
  you can download: a commercial-only patch is said to be one.
- **Runtime**: paste `/actuator/conditions`, `/beans`, `/env` or `/sbom/application` to learn why a bean
  was not created, which setting won, and what actually shipped.

Open the **Spring Stack Report** app (`apps/stack.html`), ask in chat, or have your coding agent call
the views over MCP (`StackCard`, `ModernizationFindings`, `ConfigurationProblems`, `UpgradeConfiguration`,
`VulnerableDependencies`, `VersionOverrides`, `Beans`, `Profiles`, `WhyNotApplied`, …).

Requires `realm-java-project`, and an Embabel appliance with the `maven`, `source`, `jar` and `actuator`
producer kinds. Support dates from spring.io and endoflife.date; advisories from deps.dev and OSV.

Not affiliated with or endorsed by the Spring team or Broadcom.

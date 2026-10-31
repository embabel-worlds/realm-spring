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
- **Licences**: the SPDX licence of every version you resolve, or of everything a Spring Boot release
  pins, as deps.dev records it — and which versions have none recorded.

Open the **Spring Stack Report** app (`apps/stack.html`), ask in chat, or have your coding agent call
the views over MCP (`StackCard`, `ModernizationFindings`, `ConfigurationProblems`, `UpgradeConfiguration`,
`VulnerableDependencies`, `VersionOverrides`, `ProjectLicences`, `Beans`, `Profiles`, `WhyNotApplied`, …).

Requires `realm-java-project`, and an Embabel appliance with the `maven`, `source`, `jar` and `actuator`
producer kinds. Support dates from spring.io and endoflife.date; advisories and licences from deps.dev,
fixes from OSV.

## Licences

`:Licence` is a shared label (realm-code-model's `types/artifact.yml`): the licences one published
version is distributed under, as its ecosystem records them, with `ecosystem`, `name`, `version` and
`licences` (SPDX identifiers; an empty list means none is recorded, which is not "none applies"). A
query written against it is answered by every ecosystem's realm that declares a child of it, and names
none of them. This realm brings Maven's: `MavenLicence` (`parents: [Licence]`), read from deps.dev's
GetVersion for one exact version, and reached through `LICENSED_UNDER` from the versions the realm
already knows —

```cypher
MATCH (:PublishedArtifact {ga: 'org.springframework:spring-core'})-[:PUBLISHED]->(v:PublishedVersion {version: '6.2.18'})
MATCH (v)-[:LICENSED_UNDER]->(l:Licence)
RETURN l.licences
```

— and likewise from a `BootManagedVersion` (what a Spring Boot BOM pins; the `ManagedLicences` view) and a
`ProjectDependency` (what a project resolves; `ProjectLicences`). One deps.dev call per version the first
time, kept a week; pin the version before walking to it. A running app's SBOM carries its own `licenses`
on `RuntimeComponent`, as the app recorded them, so it is not joined here.

Not affiliated with or endorsed by the Spring team or Broadcom.

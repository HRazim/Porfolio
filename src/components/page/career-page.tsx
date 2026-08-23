/**
 * Ce composant sert LES QUATRE LANGUES. Il n'en choisit aucune : la langue
 * arrive par la propriete `locale`, et les quatre fichiers de route qui
 * l'appellent — un par langue — sont les seuls a la declarer.
 */
import { Container } from '@/components/layout/container';
import { ExternalLink } from '@/components/ui/external-link';
import { Disclosure } from '@/components/ui/disclosure';
import { LocationIcon } from '@/components/ui/icons';
import { mapUrlFor } from '@/lib/map-url';
import { bindTail } from '@/lib/no-break';
import { Prose } from '@/components/layout/prose';
import { Section } from '@/components/layout/section';
import { formatDate, formatPeriod, periodDateTime } from '@/content/period';
import {
  type CareerEntry,
  type CareerKind,
  type Certification,
  formatLanguageQualification,
  getCareerEntriesByKind,
  getLanguages,
} from '@/content/career';
import type { Locale } from '@/content/i18n';
import { CAREER, COMMON, MAIN_CONTENT_ID } from '@/content/site-copy';

interface CareerSectionProps {
  readonly locale: Locale;
  readonly kind: CareerKind;
  readonly headingId: string;
  readonly heading: string;
  readonly emptyMessage: string;
}

/** Liste semantique d’entrees de parcours. Aucun libelle n’est ecrit ici. */
function CareerSection({ locale, kind, headingId, heading, emptyMessage }: CareerSectionProps) {
  const entries: readonly CareerEntry[] = getCareerEntriesByKind(kind);

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="section-rule text-display-sm text-ink">
        {heading}
      </h2>

      {entries.length === 0 ? (
        <Prose className="mt-md">
          <p>{emptyMessage}</p>
        </Prose>
      ) : (
        <ul className="mt-lg flex list-none flex-col gap-lg p-0">
          {entries.map((entry) => {
            const period = formatPeriod(entry.period, locale);
            const dateTime = periodDateTime(entry.period);

            return (
              <li
                key={entry.id}
                className="flex flex-col gap-2xs rounded-md border border-border bg-paper p-md"
              >
                <p className="font-mono text-body-sm text-ink-subtle">
                  {period === null ? (
                    COMMON.toBeSpecified[locale]
                  ) : (
                    <time dateTime={dateTime ?? undefined}>{period}</time>
                  )}
                </p>
                <h3 className="text-body-xl text-ink">{entry.title[locale]}</h3>
                {entry.organisation === null && entry.location === null ? null : (
                  <p className="font-mono text-body-sm text-ink-subtle">
                    {entry.organisation?.[locale] ?? COMMON.toBeSpecified[locale]}
                    {entry.location === null ? null : (
                      <>
                        {' — '}
                        {entry.mapQuery === null ? (
                          entry.location[locale]
                        ) : (
                          /* LA LOCALITE DEVIENT UN LIEN VERS UNE CARTE.
                             `ExternalLink` porte deja `target="_blank"`,
                             `rel="noopener noreferrer"` et la mention hors
                             ecran « (nouvelle fenetre) » : un lien sortant de
                             plus n’est pas un traitement de plus.

                             LE NOM ACCESSIBLE NE SE LIMITE PAS A LA VILLE.
                             Deux liens portant le meme texte et menant
                             ailleurs sont un defaut ; ici le nom vaut
                             « Guyancourt — Egis sur une carte (nouvelle
                             fenetre) » : il CONTIENT le texte visible, dit
                             quel lieu, et dit que la destination est une
                             carte et non une page du site.

                             `dir="ltr"` SUR LE NOM DE LIEU. En arabe, un mot
                             latin isole dans un flux droite-a-gauche est
                             rendu par l’algorithme bidirectionnel selon ce
                             qui l’entoure ; un nom propre a un ordre a lui.
                             C’est un attribut de direction, pas une propriete
                             physique — meme mecanique que les valeurs latines
                             de la liste de contact.

                             LE PICTOGRAMME EST UNE EPINGLE, non la fleche des
                             liens sortants : elle dit la carte, et le
                             changement d’onglet est deja dit par la mention
                             hors ecran. Elle ne se retourne pas en arabe —
                             une epingle designe un point, pas une fin de
                             ligne. */
                          <ExternalLink
                            locale={locale}
                            href={mapUrlFor(entry.mapQuery)}
                            showIcon={false}
                          >
                            <span dir="ltr">{entry.location[locale]}</span>
                            <LocationIcon size="sm" />
                            <span className="sr-only">
                              {` — ${entry.organisation?.[locale] ?? entry.location[locale]} ${COMMON.onMap[locale]}`}
                            </span>
                          </ExternalLink>
                        )}
                      </>
                    )}
                  </p>
                )}
                {entry.summary === null ? null : (
                  <p className="max-w-measure text-body-md text-ink-muted">{entry.summary[locale]}</p>
                )}
                {entry.highlights[locale].length === 0 ? null : (
                  <ul className="mt-2xs flex max-w-measure list-disc flex-col gap-3xs ps-md text-body-md text-ink-muted">
                    {entry.highlights[locale].map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                )}

                {/* LA DESCRIPTION EST FACULTATIVE, ET SON ABSENCE NE LAISSE
                    RIEN : ni declencheur orphelin, ni bloc vide. Le
                    `<details>` entier n’est pas rendu.

                    `<details>` PLUTOT QU’UN ETAT REACT : il se deplie sans
                    script, et son contenu figure dans le document servi meme
                    replie — un moteur d’indexation le lit sans executer une
                    ligne. Meme mecanique que le selecteur de langue, et pour
                    la meme raison.

                    Aucun composant client n’est ajoute : ni Echap ni le clic
                    exterieur n’ont de sens pour un bloc de texte pose dans le
                    flux, qui ne recouvre rien et n’attrape pas le focus. */}
                {entry.description[locale].length === 0 ? null : (
                  <Disclosure label={CAREER.entryDetails[locale]}>
                    {/* Un paragraphe par entree de la liste, et l'ecart entre
                        eux vient du conteneur : le composant n'ecrit ni
                        separateur ni marge sur le texte lui-meme.

                        `bindTail` lie les deux derniers mots de chaque
                        paragraphe : sans lui, la derniere ligne se reduit a un
                        seul mot a plusieurs largeurs — neuf cas mesures sur
                        quatre langues et huit largeurs, dont l'espagnol a
                        toutes. C'est une decision de PRESENTATION, prise ou
                        elle s'applique : la donnee, elle, ne porte aucune
                        insecable. */}
                    <div className="flex max-w-measure flex-col gap-sm">
                      {entry.description[locale].map((paragraph) => (
                        <p key={paragraph} className="text-body-md text-ink-muted">
                          {bindTail(paragraph)}
                        </p>
                      ))}
                    </div>
                  </Disclosure>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/** Langues, avec leur niveau et, le cas echeant, leur certification. */
/**
 * Detail chiffre d'une certification linguistique.
 *
 * LE SCORE TOTAL EST L'INFORMATION PRINCIPALE : il est pose en clair sous la
 * ligne de qualification, dans l'encre pleine et un cran typographique
 * au-dessus. Le reste — les epreuves, le niveau, les dates — complete, et
 * n'a pas a occuper la carte en permanence : la section aligne quatre langues
 * cote a cote, et six lignes de plus sur une seule desequilibreraient la
 * rangee. Le repli est celui des descriptions de parcours, le meme composant,
 * qui s'ouvre sans script.
 *
 * UNE LISTE DE DEFINITIONS, ET NON UN TABLEAU. Chaque ligne associe un
 * libelle a UNE valeur : c'est exactement ce que `<dl>` decrit. Un `<table>`
 * annoncerait des colonnes et des en-tetes qui n'existent pas.
 *
 * `dir="ltr"` SUR LES CHIFFRES ET SUR LE NOM DE L'EPREUVE. En arabe, « 475 /
 * 495 » et « TOEIC Listening and Reading » sont des suites latines isolees
 * dans un flux droite-a-gauche : sans direction propre, l'algorithme
 * bidirectionnel les recompose selon ce qui les entoure. C'est un attribut de
 * direction, pas une propriete physique.
 */
function CertificationDetail({
  detail,
  locale,
}: {
  readonly detail: Certification;
  readonly locale: Locale;
}) {
  const score = `${detail.score} / ${detail.max}`;

  return (
    <>
      <span dir="ltr" className="font-mono text-body-lg text-ink">
        {score}
      </span>
      <Disclosure label={CAREER.entryDetails[locale]}>
        <dl className="flex flex-col gap-3xs font-mono text-body-sm">
          {detail.sections.map((section) => (
            <div key={section.label[locale]} className="flex flex-wrap items-baseline gap-2xs">
              <dt className="text-ink-subtle">{section.label[locale]}</dt>
              <dd dir="ltr" className="text-ink">{`${section.score} / ${section.max}`}</dd>
            </div>
          ))}
          {/* PAS DE LIGNE POUR LE NIVEAU ICI. Il est deja sur la ligne de
              qualification, deux lignes plus haut dans la meme carte, ou il
              suit la convention des trois autres langues. Le poser une seconde
              fois derriere le repli, c'etait ecrire deux fois la meme valeur a
              trois centimetres d'intervalle.

              LA VALEUR RESTE UNIQUE EN DONNEE, et elle vient bien de
              l'attestation : `qualificationLevel` lit `certificationDetail.level`
              quand une certification existe, et le champ `level` de l'anglais
              reste vide. Retirer cette ligne ne change donc pas la source du
              niveau affiche, seulement le nombre de fois qu'on le lit. */}
          <div className="flex flex-wrap items-baseline gap-2xs">
            <dt className="text-ink-subtle">{CAREER.certificationObtained[locale]}</dt>
            <dd className="text-ink">{formatDate(detail.obtained, locale)}</dd>
          </div>
          <div className="flex flex-wrap items-baseline gap-2xs">
            <dt className="text-ink-subtle">{CAREER.certificationValidUntil[locale]}</dt>
            <dd className="text-ink">{formatDate(detail.validUntil, locale)}</dd>
          </div>
        </dl>
      </Disclosure>
    </>
  );
}

function LanguagesSection({ locale }: { readonly locale: Locale }) {
  const languages = getLanguages();

  return (
    <section aria-labelledby="langues">
      <h2 id="langues" className="section-rule text-display-sm text-ink">
        {CAREER.languagesHeading[locale]}
      </h2>

      {languages.length === 0 ? (
        <Prose className="mt-md">
          <p>{CAREER.languagesEmpty[locale]}</p>
        </Prose>
      ) : (
        <ul className="mt-lg flex list-none flex-wrap gap-md p-0">
          {languages.map((language) => (
            <li
              key={language.id}
              className="flex flex-col gap-3xs rounded-md border border-border bg-paper px-md py-sm"
            >
              <span className="text-body-md text-ink">{language.name[locale]}</span>
              <span dir="ltr" className="font-mono text-body-sm text-ink-subtle">
                {formatLanguageQualification(language, locale)}
              </span>
              {language.certificationDetail === null ? null : (
                <CertificationDetail detail={language.certificationDetail} locale={locale} />
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * Parcours : formation, experiences et langues.
 *
 * Les lectures ont rejoint la page « À propos » : elles disent ce qui a
 * change une facon de travailler, pas ce qui a ete valide par un jury. Elles
 * detonnaient entre les diplomes et les niveaux de langue.
 *
 * Les trois listes sont alimentees par src/content/career.ts. Aucune ville
 * n’est deduite d’un nom d’etablissement et aucun mois n’est ajoute a une
 * annee : la granularite affichee est celle de la donnee disponible.
 *
 * Rendu cote serveur, statiquement.
 */
export function CareerPage({ locale }: { readonly locale: Locale }) {
  return (
    /* CASCADE D'ARRIVEE. Elle est le mecanisme de transition des navigations
       INTERNES a une langue : le routeur remplace le `<main>`, l'animation
       repart. `cascade-tight` la cadence a `--duration-base`, un pas de
       `--duration-stagger` : rang 1 a 200 ms, rang 2 a 280 ms.

       LE SURTITRE ET LE TITRE N'ONT AUCUN RANG. Ils sont peints avec la page,
       a l'instant zero : le contenu est lisible avant que la cascade ne
       commence, et elle ne retarde donc jamais la lecture. */
    <main id={MAIN_CONTENT_ID} className="cascade-tight">
      <Section spacing="spacious" background="paper">
        <Container>
          <p className="font-mono text-body-sm text-ink-subtle">{CAREER.eyebrow[locale]}</p>
          <h1 className="section-rule mt-sm text-display-lg text-ink">{CAREER.heading[locale]}</h1>
          <Prose size="lead" className="mt-lg">
            <p data-enter="1">{CAREER.intro[locale]}</p>
          </Prose>
        </Container>
      </Section>

      <Section background="surface" enter={2}>
        <Container>
          <div className="flex flex-col gap-3xl">
            <CareerSection
              locale={locale}
              kind="formation"
              headingId="formation"
              heading={CAREER.formationHeading[locale]}
              emptyMessage={CAREER.formationEmpty[locale]}
            />
            <CareerSection
              locale={locale}
              kind="experience"
              headingId="experiences"
              heading={CAREER.experienceHeading[locale]}
              emptyMessage={CAREER.experienceEmpty[locale]}
            />
            <LanguagesSection locale={locale} />
          </div>
        </Container>
      </Section>
    </main>
  );
}

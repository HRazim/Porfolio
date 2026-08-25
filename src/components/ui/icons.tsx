import type { ReactNode } from 'react';

import type { ProjectLinkKind } from '@/content/projects';
import { cn } from '@/lib/cn';
import type { ContactKind, SocialNetwork } from '@/lib/site';

/**
 * ---------------------------------------------------------------------------
 * ICONES — SVG EN LIGNE, AUCUNE DEPENDANCE
 * ---------------------------------------------------------------------------
 *
 * AUDIT.md section 4.5 : le site precedent telechargeait 258 144 octets de
 * polices Font Awesome pour 17 glyphes distincts, soit environ 15 Ko par
 * pictogramme affiche, au prix d’une cascade de trois requetes vers un
 * domaine tiers.
 *
 * Ces icones pesent ce que pese leur balisage, sont rendues cote
 * serveur, et ne declenchent aucune requete.
 *
 * Regles :
 *   - `currentColor` exclusivement : la couleur vient du contexte, jamais
 *     d’une valeur ecrite ici ;
 *   - taille puisee dans l’echelle d’espacement, jamais en pixels ;
 *   - `aria-hidden` par defaut. Une icone n’est annoncee que si un `title`
 *     lui est explicitement donne, auquel cas elle prend `role="img"`.
 *
 * Les coordonnees des traces sont necessairement numeriques : une geometrie
 * vectorielle ne se tokenise pas.
 * ---------------------------------------------------------------------------
 */

export type IconSize = 'sm' | 'md' | 'lg';

export interface IconProps {
  /** Defaut : `md`. Puise dans l’echelle d’espacement. */
  readonly size?: IconSize;
  readonly className?: string;
  /**
   * Titre accessible. Absent, l’icone est decorative et masquee aux
   * technologies d’assistance.
   */
  readonly title?: string;
}

export type IconComponent = (props: IconProps) => ReactNode;

const SIZE_CLASS: Record<IconSize, string> = {
  sm: 'size-sm', // 16px
  md: 'size-md', // 24px
  lg: 'size-lg', // 32px
};

interface IconBaseProps extends IconProps {
  readonly children: ReactNode;
  /** Traces pleins (logos) plutot que traces au filet. */
  readonly filled?: boolean;
}

function IconBase({ size = 'md', className, title, children, filled = false }: IconBaseProps) {
  const decorative = title === undefined;

  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? undefined : 1.75}
      strokeLinecap={filled ? undefined : 'round'}
      strokeLinejoin={filled ? undefined : 'round'}
      className={cn(SIZE_CLASS[size], 'shrink-0', className)}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : 'img'}
      focusable="false"
    >
      {decorative ? null : <title>{title}</title>}
      {children}
    </svg>
  );
}

export function GitHubIcon(props: IconProps) {
  return (
    <IconBase {...props} filled>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.24-.02-2.25-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.21.7.82.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </IconBase>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <IconBase {...props} filled>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </IconBase>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 6.5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <path d="m3.6 7 8.4 6 8.4-6" />
    </IconBase>
  );
}

export function LocationIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.75" />
    </IconBase>
  );
}

export function DocumentIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13.5h6" />
      <path d="M9 17h4" />
    </IconBase>
  );
}

/**
 * ---------------------------------------------------------------------------
 * ICONES DIRECTIONNELLES
 * ---------------------------------------------------------------------------
 *
 * Une fleche qui dit « la suite » pointe vers la fin de la ligne : a droite en
 * ecriture latine, A GAUCHE en arabe. Une fleche figee vers la droite y
 * signifierait « retour en arriere ».
 *
 * Le retournement est pose SUR LE COMPOSANT, pas sur ses appels : un
 * appelant qui l’oublierait produirait une fleche a contresens, et rien ne le
 * signalerait. Il n’y a donc rien a se rappeler.
 *
 * `rtl:` est une variante de Tailwind qui cible `[dir='rtl']`. Elle ne
 * s’active que sous l’attribut de direction pose par la mise en page racine
 * arabe — les trois autres langues ne voient pas la regle.
 */
const FLIP_IN_RTL = 'rtl:-scale-x-100';

export function ArrowIcon({ className, ...props }: IconProps) {
  return (
    <IconBase {...props} className={cn(FLIP_IN_RTL, className)}>
      <path d="M4 12h16" />
      <path d="m13 5 7 7-7 7" />
    </IconBase>
  );
}

export function ExternalLinkIcon({ className, ...props }: IconProps) {
  return (
    <IconBase {...props} className={cn(FLIP_IN_RTL, className)}>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
    </IconBase>
  );
}

/**
 * Chevron vers le bas.
 *
 * IL NE SE RETOURNE PAS. Un chevron vertical designe le bas, pas la fin de la
 * ligne : `FLIP_IN_RTL` n’a rien a y faire, contrairement a la fleche et au
 * lien externe ci-dessus. En arabe comme en francais, un panneau se deploie
 * vers le bas.
 */
export function ChevronDownIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </IconBase>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </IconBase>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.4v2.2M12 19.4v2.2M4.2 12H2M22 12h-2.2" />
      <path d="M6.5 6.5 4.9 4.9M19.1 19.1l-1.6-1.6M17.5 6.5l1.6-1.6M4.9 19.1l1.6-1.6" />
    </IconBase>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20.2 14.4A8.4 8.4 0 0 1 9.6 3.8a8.4 8.4 0 1 0 10.6 10.6Z" />
    </IconBase>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5.25" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function XIcon(props: IconProps) {
  return (
    <IconBase {...props} filled>
      <path d="M17.53 3h3.02l-6.6 7.54L21.7 21h-6.07l-4.76-6.22L5.44 21H2.42l7.06-8.07L2.3 3h6.23l4.3 5.69L17.53 3Zm-1.06 16.2h1.67L7.6 4.71H5.81l10.66 14.49Z" />
    </IconBase>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <IconBase {...props} filled>
      <path d="M16.6 2h-3.02v13.4a2.62 2.62 0 1 1-2.62-2.62c.24 0 .47.03.69.09v-3.1a5.9 5.9 0 0 0-.69-.04 5.72 5.72 0 1 0 5.72 5.72V8.9a6.9 6.9 0 0 0 4.03 1.29V7.1a3.9 3.9 0 0 1-2.83-1.32A3.94 3.94 0 0 1 16.6 2Z" />
    </IconBase>
  );
}

/**
 * Google Play.
 *
 * LA SILHOUETTE DE LA MARQUE EST CE TRIANGLE. Ses quatre volets colores se
 * rejoignent a l'interieur, mais leur contour exterieur est bien un triangle
 * a bord gauche vertical : rien ne depasse.
 *
 * LES PLIS INTERIEURS ONT ETE ESSAYES, ET RETIRES. Traces au filet, le V qui
 * rend les volets se lit a seize pixels comme un second chevron : l'icone
 * disait « avance rapide ». Mesure sur rendu, agrandie a cent soixante
 * pixels, avant d'etre abandonnee — c'etait la seule facon de le voir.
 *
 * CE QUI IDENTIFIE LA DESTINATION, C'EST LE LIBELLE. Il nomme Google Play en
 * toutes lettres, dans les quatre langues, et l'icone porte `aria-hidden` :
 * elle distingue une ligne des cinq autres, elle ne les nomme pas.
 *
 * Pleine, comme les autres marques de ce fichier — GitHub, LinkedIn, X.
 */
export function GooglePlayIcon(props: IconProps) {
  return (
    <IconBase {...props} filled>
      <path d="M4.6 2.5 20.4 12 4.6 21.5Z" />
    </IconBase>
  );
}

export function RedditIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="13.4" r="8" />
      <circle cx="9.1" cy="12.9" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="14.9" cy="12.9" r="1.05" fill="currentColor" stroke="none" />
      <path d="M9 16.4c1.7 1.2 4.3 1.2 6 0" />
      <path d="M13.4 5.4 12 13.4" />
      <circle cx="13.9" cy="4.4" r="1.4" />
    </IconBase>
  );
}

/**
 * Correspondances nom -> composant.
 * Elles evitent tout branchement sur une chaine a l’interieur du JSX.
 */
export const SOCIAL_ICONS: Readonly<Record<SocialNetwork, IconComponent>> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
};

/**
 * Pictogramme de chaque nature de lien sortant d’une realisation.
 * Table exhaustive : ajouter une nature sans son icone ne compile pas.
 */
export const PROJECT_LINK_ICONS: Readonly<Record<ProjectLinkKind, IconComponent>> = {
  source: GitHubIcon,
  'google-play': GooglePlayIcon,
  demo: ExternalLinkIcon,
  article: DocumentIcon,
  documentation: DocumentIcon,
  instagram: InstagramIcon,
  x: XIcon,
  tiktok: TikTokIcon,
  reddit: RedditIcon,
};

export const CONTACT_ICONS: Readonly<Record<ContactKind, IconComponent>> = {
  email: MailIcon,
  location: LocationIcon,
};

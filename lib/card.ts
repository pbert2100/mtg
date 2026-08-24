/**
 * Medidas de uma carta de Magic (63x88mm), compartilhadas entre servidor e cliente.
 * Ficam aqui, e não em TiltCard.tsx, porque aquele módulo é "use client": constantes
 * exportadas de um módulo cliente viram referências opacas quando importadas por um
 * Server Component.
 */

/** Raio dos cantos: 3mm proporcionais à largura e à altura. */
export const CARD_RADIUS = "4.8% / 3.4%";

/**
 * Pódio da home: as três cartas cabem lado a lado mesmo em 375px, para a página não
 * abrir com uma tela e meia só de cabeçalho. O `calc` desconta os dois vãos de 0.5rem.
 */
export const CARD_WIDTH_PODIO = "w-[calc((100%-1rem)/3)] sm:w-[214px] lg:w-[236px]";

/** Commanders de um jogador: duas por linha no celular. */
export const CARD_WIDTH = "w-[calc((100%-0.75rem)/2)] sm:w-[214px] lg:w-[236px]";

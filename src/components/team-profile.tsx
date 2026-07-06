"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { AchievementType } from "@/lib/types";
import { ROLE_META } from "@/lib/types";
import { getTeam, teamHonor, teamPlayers, rankedTeams } from "@/lib/teams";
import { Plate } from "@/components/ui/plate";
import { formatNumber } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

export function TeamProfile({ id }: { id: string }) {
  const { t } = useI18n();
  const team = getTeam(id);
  if (!team) notFound();

  const honor = teamHonor(team);
  const players = teamPlayers(team);
  const rank = rankedTeams().findIndex((x) => x.team.id === id) + 1;

  const allGroups: { type: AchievementType; years: number[] }[] = [
    { type: "worlds_title", years: team.worlds },
    { type: "msi_title", years: team.msi },
    { type: "ewc_title", years: team.ewc ?? [] },
    { type: "first_stand_title", years: team.firstStand ?? [] },
    { type: "worlds_runnerup", years: team.worldsRunnerup ?? [] },
  ];
  const titleGroups = allGroups.filter((g) => g.years.length > 0);

  return (
    <div className="crest">
      <div className="pad">
        <Link href="/lol/teams" className="back"><span aria-hidden>←</span> {t("common.back")}</Link>
      </div>

      <section className="hero pad">
        <div className="col-grid" />
        <span className="ghost-glyph" style={{ right: "3%", top: "-6%", fontSize: "clamp(150px,26vw,420px)" }}>
          {team.code}
        </span>
        <span className="v-edge" style={{ position: "absolute", right: "18px", top: "60px" }}>
          PANTHEON · ANNO MMXXVI
        </span>
        <div style={{ position: "relative" }} data-reveal>
          <p className="kick">
            № {rank} · {team.region} · {t("nav.teams")}
          </p>
          <h1 className="name">{team.name}</h1>
          {team.aka && team.aka.length > 0 && <p className="aka">{team.aka.join(" · ")}</p>}
          <div className="idx">
            <span className="lab">{t("player.honorIndex")}</span>
            <span className="val">{formatNumber(honor)}</span>
          </div>
        </div>
      </section>

      {titleGroups.length > 0 && (
        <section className="titles" data-reveal>
          {titleGroups.map((g) => {
            const gold = g.type !== "worlds_runnerup";
            return (
              <div key={g.type} className={`tcell${gold ? " gold" : ""}`}>
                <div className="n">{g.years.length}</div>
                <div className="lab">{t(`honorType.${g.type}`)}</div>
                <div className="yrs">
                  {g.years.map((y) => (
                    <span key={y}>{`'${String(y).slice(2)}`}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {players.length > 0 && (
        <section className="sec pad" style={{ paddingTop: "8px" }} data-reveal>
          <Plate n="Ⅰ" title={t("home.teamRoster")} note={String(players.length)} />
          <div className="roster">
            {players.map((p) => {
              const roleText = !p.active
                ? t("common.retired")
                : t(`role.${p.role}`) !== `role.${p.role}`
                  ? t(`role.${p.role}`)
                  : ROLE_META[p.role].abbr;
              return (
                <Link
                  key={p.id}
                  href={`/lol/players/${p.id}`}
                  className="rcell"
                  aria-label={`${p.name}, ${roleText}`}
                >
                  <span className="pn">{p.name}</span>
                  <span className="role">{!p.active ? t("common.retired") : ROLE_META[p.role].abbr}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

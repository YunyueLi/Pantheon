"use client";

import Link from "next/link";
import { rankedTeams } from "@/lib/teams";
import { TrophyIcon } from "@/components/trophy-icon";
import { formatNumber } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

export default function TeamsPage() {
  const { t } = useI18n();
  const teams = rankedTeams();
  const maxHonor = Math.max(1, ...teams.map((x) => x.honor));

  return (
    <div className="houses">
      <header className="head pad">
        <div className="col-grid" />
        <span className="ghost-glyph" style={{ right: "-1%", top: "-12%", fontSize: "clamp(260px,40vw,600px)" }}>
          ♛
        </span>
        <span className="v-edge" style={{ position: "absolute", right: "18px", top: "58px" }}>
          {t("nav.lol")} · MMXXVI
        </span>
        <div style={{ position: "relative" }}>
          <p className="kick">{t("home.eyebrow")}</p>
          <h1>{t("nav.teams")}</h1>
          <p className="desc">{t("home.teamsDesc")}</p>
        </div>
      </header>

      <div className="pad">
        {teams.map(({ team, honor, rank }) => {
          const counts = [
            { type: "worlds_title" as const, n: team.worlds.length, gold: true },
            { type: "msi_title" as const, n: team.msi.length, gold: true },
            { type: "ewc_title" as const, n: team.ewc?.length ?? 0, gold: true },
            { type: "first_stand_title" as const, n: team.firstStand?.length ?? 0, gold: true },
            { type: "worlds_runnerup" as const, n: team.worldsRunnerup?.length ?? 0, gold: false },
          ].filter((c) => c.n > 0);
          return (
            <Link key={team.id} href={`/lol/teams/${team.id}`} className="row">
              <span className="rk">{String(rank).padStart(2, "0")}</span>
              <div style={{ minWidth: 0 }}>
                <span className="nm">{team.name}</span>
                <div className="meta">
                  <span className="reg">{team.region}</span>
                  {counts.length > 0 && (
                    <span className="chips">
                      {counts.map((c) => (
                        <span key={c.type} className="chip">
                          <TrophyIcon
                            type={c.type}
                            size={15}
                            className={c.gold ? "text-[color:var(--medal-gold)]" : "text-fg-subtle"}
                          />
                          {c.n}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </div>
              <div className="sc">
                <div className="v">{formatNumber(honor)}</div>
                <div className="bar">
                  <span style={{ width: `${(honor / maxHonor) * 100}%` }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

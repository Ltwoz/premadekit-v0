"use client";

import { useModal } from "@/components/premadekit/modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ChevronsUpDownIcon, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { CreateTeamForm } from "./create-team-form";

interface TeamSwitcherProps {
  teams: {
    label: string | null;
    value: string | null;
    pictureUrl?: string | null;
  }[];
  selectedTeam: string;
  onTeamChange: (team: string | undefined) => void;
}

export function TeamSwitcher({
  teams,
  selectedTeam,
  onTeamChange,
}: TeamSwitcherProps) {
  const [open, setOpen] = useState(false);

  const selected = teams.find((team) => team.value === selectedTeam);

  const modal = useModal();

  function handleCreateTeam() {
    modal.showModal(<CreateTeamForm />, "Create Team", "Create a new Team to manage your projects and members.");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          className="justify-between w-fit px-2"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage className="object-cover" src={selected?.pictureUrl ?? undefined} />
            <AvatarFallback className="text-xs">
              {selected?.label ? selected.label[0] : ""}
            </AvatarFallback>
          </Avatar>
          <span className="truncate">{selected?.label}</span>
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput placeholder="Find team..." />
          <CommandList>
            <CommandGroup>
              {teams.map((team) => (
                <CommandItem
                  key={team.value}
                  value={team.value ?? ""}
                  className="text-sm cursor-pointer"
                  onSelect={(currentValue) => {
                    setOpen(false);

                    if (onTeamChange) {
                      onTeamChange(currentValue);
                    }
                  }}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={team?.pictureUrl ?? undefined} />
                    <AvatarFallback className="text-xs">
                      {team?.label ? team.label[0] : ""}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{team.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <Separator />
        <div className="p-1">
          <Button
            data-test={"create-team-account-trigger"}
            variant="ghost"
            size={"sm"}
            className="w-full justify-start text-sm font-normal px-2"
            onClick={() => {
              handleCreateTeam();
              setOpen(false);
            }}
          >
            <span className="flex justify-center items-center w-6 h-6">
              <PlusCircleIcon />
            </span>

            <span>Create Team</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

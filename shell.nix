{ pkgs ? import <nixpkgs> {} }:
	pkgs.mkShell {
		packages = [ pkgs.bun pkgs.typescript-language-server ];
}